import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  _id: string;
  title: string;
  content: { type: string; data: string }[];
  imageUrl: string;
  formattedDate: string;
  author: {
    name: string;
  };
  views?: number; // Optional since we fetch from localStorage
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get stored views from localStorage
  const getStoredViews = (): Record<string, number> => {
    const storedViews = localStorage.getItem("blogViews");
    return storedViews ? JSON.parse(storedViews) : {};
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blog/blogs");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data: BlogPost[] = await response.json();

        // Get views from localStorage
        const storedViews = getStoredViews();

        // Merge views with blogs
        const blogsWithViews = data.map((blog) => ({
          ...blog,
          views: storedViews[blog._id] || 0, // Default to 0 if no views
        }));

        // Sort by views (highest to lowest) and take the top 6
        const topBlogs = blogsWithViews.sort((a, b) => b.views - a.views).slice(0, 6);

        setBlogs(topBlogs);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Function to increment views when a user clicks "Read More"
  const handleViewIncrease = (id: string) => {
    const storedViews = getStoredViews();
    storedViews[id] = (storedViews[id] || 0) + 1;
    localStorage.setItem("blogViews", JSON.stringify(storedViews));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="mt-20 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium">Our Recent News</h2>
          <p className="mt-2 text-gray-700">
            Everything that is trending in tech, just for you.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {blogs.map((blog) => {
            const textContent = blog.content.find((item) => item.type === "text")?.data || "";
            const truncatedContent = textContent.split("\n").slice(0, 2).join(" ");

            return (
              <article key={blog._id} className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow">
                <div className="h-36 overflow-hidden">
                  <img src={blog.imageUrl} alt={blog.title} className="size-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{blog.title}</h3>
                  <time dateTime={blog.formattedDate} className="mt-1 text-sm text-gray-500">
                    {blog.formattedDate}
                  </time>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{truncatedContent}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">{blog.author.name}</p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Views: {blog.views}</p>
                  <Link
                    to={`/blog/${blog._id}`}
                    onClick={() => handleViewIncrease(blog._id)}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-md text-center"
                  >
                    Read More
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
