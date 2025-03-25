import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface BlogPost {
  _id: string;
  title: string;
  content: { type: string; data: string }[];
  imageUrl: string;
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
  const [name, setName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blog/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blog/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name before submitting a comment.");
      return;
    }
  
    try {
      await axios.post(`http://localhost:5000/blog/${id}/comments`, {
        text: newComment,
        author: name,
      });
  
      setNewComment("");
      setName("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4 px-6 sm:px-8 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Blog Details</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
        >
          Home
        </button>
      </nav>

      {/* Background Decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-70 -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 py-12 relative">
        {/* Blog Content Area */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Decorative Line */}
          <div className="hidden lg:block col-span-1 relative">
            <div className="sticky top-24 h-full">
              <div className="w-px h-full bg-gradient-to-b from-gray-200 to-transparent mx-auto"></div>
            </div>
          </div>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-10">
            {/* Blog Header */}
            <header className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">{blog.title}</h1>
              <div className="flex justify-center space-x-4 text-gray-500 mt-4 text-sm">
                <time dateTime={blog.formattedDate} className="italic">{blog.formattedDate}</time>
                <span>•</span>
                <p className="font-medium text-gray-900">By {blog.author.name}</p>
              </div>
            </header>

            {/* Blog Content */}
            <article className="prose prose-lg max-w-none bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-12">
              {blog.content.map((item, index) => {
                if (item.type === "text") {
                  const cleanedText = item.data.replace(/(https?:\/\/[^\s]+)/g, "");
                  return cleanedText.split("\n\n").map((paragraph, idx) => (
                    <p key={`${index}-${idx}`} className="text-gray-800 leading-relaxed mb-6">{paragraph}</p>
                  ));
                } else if (item.type === "image") {
                  return (
                    <figure key={index} className="my-8">
                      <img
                        src={item.data}
                        alt={`Content Image ${index}`}
                        className="w-full max-h-96 object-contain rounded-lg shadow-md"
                      />
                      <figcaption className="text-center text-sm text-gray-500 mt-2">
                        Image {index + 1}
                      </figcaption>
                    </figure>
                  );
                }
                return null;
              })}
            </article>

            {/* Comments Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
              
              {comments.length === 0 ? (
                <p className="text-gray-500 italic">Be the first to comment on this article!</p>
              ) : (
                <div className="space-y-6">
                  {!showAllComments ? (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{comments[0].text}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          By <span className="font-medium">{comments[0].author}</span> •{" "}
                          {new Date(comments[0].date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {comments.length > 1 && (
                        <button
                          onClick={() => setShowAllComments(true)}
                          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center"
                        >
                          <span>View All {comments.length} Comments</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-4 divide-y divide-gray-200">
                        {comments.map((comment) => (
                          <div key={comment._id} className="pt-4 first:pt-0">
                            <p className="text-gray-700">{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              By <span className="font-medium">{comment.author}</span> •{" "}
                              {new Date(comment.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowAllComments(false)}
                        className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center"
                      >
                        <span>Show Less</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Comments Form */}
            <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave a Comment</h2>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                  <textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={4}
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                >
                  Submit Comment
                </button>
              </form>
            </section>
          </main>

          {/* Right Decorative Line */}
          <div className="hidden lg:block col-span-1 relative">
            <div className="sticky top-24 h-full">
              <div className="w-px h-full bg-gradient-to-b from-gray-200 to-transparent mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;