
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface BlogPost {
  _id: string;
  title: string;
  content: { type: string; data: string }[];
  formattedDate: string;
  author: { name: string };
  imageUrl: string;
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
  const [heroImage, setHeroImage] = useState<string>('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blog/blogs/${id}`);
        setBlog(response.data);
        setHeroImage(response.data.imageUrl || '');
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
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 text-base">
                    {children}
                  </p>
                );
              case 'strong':
              case 'b':
                return <strong className="font-semibold text-gray-900">{children}</strong>;
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
          <figure key={index} className="my-6">
            <img
              src={item.data}
              alt={`Content Image ${index}`}
              className="w-full max-h-80 object-cover rounded-lg shadow-sm"
            />
          </figure>
        );
      }

      return null;
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-pulse text-xl text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[28rem] overflow-hidden">
        {heroImage ? (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Hero Image"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
        )}

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center max-w-6xl mx-auto px-4 -ml-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
            {blog.title}
          </h1>
          <div className="text-white/90 text-lg -ml-80">
            <time dateTime={blog.formattedDate} className="mr-4">
              {blog.formattedDate}
            </time>
            <span className="mr-4">•</span>
            <span>by {blog.author.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Blog Content */}
        <article className="bg-[#f5f5f5f] rounded-lg shadow-sm p-8 mb-12">
          <div className="prose prose-lg max-w-none">
            {renderBlogContent(blog.content)}
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Comments
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-6 mb-8">
              {!showAllComments ? (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {comments[0].author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 mb-2">{comments[0].text}</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">{comments[0].author}</span>
                          <span className="mx-2">•</span>
                          {new Date(comments[0].date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {comments.length > 1 && (
                    <button
                      onClick={() => setShowAllComments(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View all {comments.length} comments
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment._id} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800 mb-2">{comment.text}</p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">{comment.author}</span>
                              <span className="mx-2">•</span>
                              {new Date(comment.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAllComments(false)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Show less
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Comment</h3>

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Write a comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Share your thoughts..."
                required
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
