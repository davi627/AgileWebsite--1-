import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000';

interface BlogPost {
  _id: string;
  title: string;
  content: { type: string; data: string }[];
  formattedDate: string;
  author: { name: string };
}

interface Comment {
  _id: string;
  text: string;
  author: string;
  date: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [hasSkippedCoverImage, setHasSkippedCoverImage] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blog/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blog/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name before submitting a comment.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/blog/${id}/comments`, {
        text: newComment,
        author: name
      });

      setNewComment('');
      setName('');
      const response = await axios.get(`${API_BASE_URL}/blog/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const renderBlogContent = (content: { type: string; data: string }[]) => {
    return content.map((item, index) => {
      if (item.type === 'image' && !hasSkippedCoverImage) {
        setHasSkippedCoverImage(true);
        return null;
      }

      if (item.type === 'text') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.data;

        const processNode = (node: ChildNode): React.ReactNode => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent?.split('\n').map((text, i) => (
              <React.Fragment key={i}>
                {text}
                {i < node.textContent!.split('\n').length - 1 && <br />}
              </React.Fragment>
            ));
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const children = Array.from(element.childNodes).map(processNode);

            switch (element.tagName.toLowerCase()) {
              case 'p':
                return (
                  <p key={index} className="text-gray-800 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                    {children}
                  </p>
                );
              case 'strong':
              case 'b':
                return <strong className="font-bold">{children}</strong>;
              case 'em':
              case 'i':
                return <em className="italic">{children}</em>;
              case 'u':
                return <u className="underline">{children}</u>;
              case 'br':
                return <br />;
              default:
                return <span>{children}</span>;
            }
          }

          return null;
        };

        return Array.from(tempDiv.childNodes).map((node, idx) => (
          <React.Fragment key={idx}>{processNode(node)}</React.Fragment>
        ));
      }

      if (item.type === 'image') {
        return (
          <figure key={index} className="my-4 sm:my-6">
            <img
              src={item.data}
              alt={`Content Image ${index}`}
              className="w-full max-h-60 sm:max-h-80 object-contain rounded-lg shadow-md mx-auto"
            />
            <figcaption className="text-center text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              Image {index}
            </figcaption>
          </figure>
        );
      }

      return null;
    });
  };

  if (!blog) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex justify-center items-center bg-gray-50">
          <div className="animate-pulse text-xl text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 relative font-Poppins">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="hidden lg:block col-span-1 relative">
              <div className="sticky top-24 h-full">
                <div className="w-px h-full bg-gradient-to-b from-gray-200 to-transparent mx-auto"></div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-10">
              <header className="text-center mb-4 sm:mb-6 md:mb-8 mt-28">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mt-4 sm:mt-6">
                  {blog.title}
                </h1>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-500 mt-2 sm:mt-3 text-xs sm:text-sm">
                  <time dateTime={blog.formattedDate} className="italic">
                    {blog.formattedDate}
                  </time>
                  <span className="hidden sm:inline">•</span>
                  <p className="font-medium text-gray-900">
                    By {blog.author.name}
                  </p>
                </div>
              </header>

              <article className="prose prose-sm sm:prose-lg max-w-none bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
                {renderBlogContent(blog.content)}
              </article>

              <section className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Comments
                </h2>

                {comments.length === 0 ? (
                  <p className="text-gray-500 italic text-xs sm:text-sm">
                    Be the first to comment on this article!
                  </p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {!showAllComments ? (
                      <>
                        <div className="bg-gray-50 p-2 sm:p-3 rounded-md">
                          <p className="text-gray-700 text-xs sm:text-sm">
                            {comments[0].text}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            By{' '}
                            <span className="font-medium">
                              {comments[0].author}
                            </span>{' '}
                            •{' '}
                            {new Date(comments[0].date).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }
                            )}
                          </p>
                        </div>

                        {comments.length > 1 && (
                          <button
                            onClick={() => setShowAllComments(true)}
                            className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center text-xs sm:text-sm"
                          >
                            <span>View All {comments.length} Comments</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="space-y-3 sm:space-y-4 divide-y divide-gray-200">
                          {comments.map((comment) => (
                            <div key={comment._id} className="pt-3 first:pt-0">
                              <p className="text-gray-700 text-xs sm:text-sm">
                                {comment.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                By{' '}
                                <span className="font-medium">
                                  {comment.author}
                                </span>{' '}
                                •{' '}
                                {new Date(comment.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  }
                                )}
                              </p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setShowAllComments(false)}
                          className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center text-xs sm:text-sm"
                        >
                          <span>Show Less</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </section>

              <section className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Leave a Comment
                </h2>
                <form
                  onSubmit={handleCommentSubmit}
                  className="space-y-2 sm:space-y-3"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm"
                      rows={3}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-alternate text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg transition-colors font-medium text-xs sm:text-sm shadow-sm"
                  >
                    Submit Comment
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
