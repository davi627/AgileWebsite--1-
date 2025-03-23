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
  const [name, setName] = useState(""); // New state for name input
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
      const response = await axios.post(`http://localhost:5000/blog/${id}/comments`, {
        text: newComment,
        author: name, // Save the entered name
      });

      setComments([...comments, response.data]);
      setNewComment("");
      setName(""); // Reset name field after submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!blog) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Blog Details</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Home
        </button>
      </nav>

      <div className="mx-auto max-w-5xl px-6 lg:px-12 py-12">
        {/* Blog Header */}
        <header className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">{blog.title}</h1>
          <div className="flex justify-center space-x-4 text-gray-500 mt-4 text-sm">
            <time dateTime={blog.formattedDate}>{blog.formattedDate}</time>
            <span>•</span>
            <p className="font-medium text-gray-900">By {blog.author.name}</p>
          </div>
        </header>



        {/* Blog Content */}
{/* Blog Content */}
{/* Blog Content */}
<article className="mt-12 mx-auto w-3/4 text-gray-800 leading-relaxed space-y-6">
  {blog.content.map((item, index) => {
    if (item.type === "text") {
      // Remove any URLs (including image URLs) from the text
      const cleanedText = item.data.replace(/(https?:\/\/[^\s]+)/g, "");

      return cleanedText.split("\n\n").map((paragraph, idx) => (
        <p key={`${index}-${idx}`} className="text-lg mb-4">{paragraph}</p>
      ));
    } else if (item.type === "image") {
      return (
        <img
          key={index}
          src={item.data}
          alt={`Content Image ${index}`}
          className="w-full h-auto rounded-xl shadow-lg my-6"
        />
      );
    }
    return null;
  })}
</article>


        {/* Comments Preview */}
        <div className="mt-16 w-3/4 mx-auto">
          {comments.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              {!showAllComments ? (
                <>
                  {/* Show Only One Comment */}
                  <p className="text-gray-700">{comments[0].text}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    By {comments[0].author} •{" "}
                    {new Date(comments[0].date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  {/* "View All Comments" Button */}
                  {comments.length > 1 && (
                    <button
                      onClick={() => setShowAllComments(true)}
                      className="mt-4 text-blue-600 font-semibold hover:underline"
                    >
                      View All Comments
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* All Comments in One Card */}
                  <h2 className="text-xl font-bold mb-4">All Comments</h2>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id}>
                        <p className="text-gray-700">{comment.text}</p>
                        <p className="text-xs text-gray-500">
                          By {comment.author} •{" "}
                          {new Date(comment.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <hr className="border-gray-200 my-2" />
                      </div>
                    ))}
                  </div>

                  {/* Hide Comments Button */}
                  <button
                    onClick={() => setShowAllComments(false)}
                    className="mt-4 text-blue-600 font-semibold hover:underline"
                  >
                    Hide Comments
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Comments Form */}
        <div className="mt-12 w-3/4 mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add a Comment</h2>
          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
            {/* Name Input Field */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Your Name"
              required
            />

            {/* Comment Input Field */}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              rows={4}
              placeholder="Write a comment..."
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
