import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  _id: string;
  title: string;
  content: { type: string; data: string }[];
  imageUrl: string;
  formattedDate: string;
  author: { name: string };
  views?: number;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blog/blogs");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        let data: BlogPost[] = await response.json();
  
        // Retrieve views from localStorage
        const storedViews = JSON.parse(localStorage.getItem("blogViews") || "{}");
  
        // Merge stored views into fetched data
        data = data.map((blog) => ({
          ...blog,
          views: storedViews[blog._id] || blog.views || 0, 
        }));
  
        // Store all blogs in localStorage for TopBlogs component
        localStorage.setItem("allBlogs", JSON.stringify(data));
  
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlogs();
  }, []);
  
  const handleViewBlog = (blogId: string) => {
    // Retrieve stored views
    const storedViews = JSON.parse(localStorage.getItem("blogViews") || "{}");

    // Increment views for the selected blog
    storedViews[blogId] = (storedViews[blogId] || 0) + 1;

    // Save back to localStorage
    localStorage.setItem("blogViews", JSON.stringify(storedViews));

    // Update state to reflect new views
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId ? { ...blog, views: storedViews[blogId] } : blog
      )
    );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="mt-10 bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Home Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            Home
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Latest Blog Posts</h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => {
            const textContent = blog.content.find((item) => item.type === "text")?.data || "";
            const truncatedContent = textContent.split("\n")[0].slice(0, 40) + "..."; 

            return (
              <article
                key={blog._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform border"
              >
                <div className="h-24">
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 line-clamp-1">{blog.title}</h3>
                  <p className="text-xs text-gray-600">
                    By {blog.author?.name || "Unknown"} • {blog.views || 0} views
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{truncatedContent}</p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-blue-500 text-xs font-medium mt-2 inline-block"
                    onClick={() => handleViewBlog(blog._id)}
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
