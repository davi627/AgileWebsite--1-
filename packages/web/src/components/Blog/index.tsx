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

export default function TopBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogViews");
    const allBlogs = localStorage.getItem("allBlogs"); 

    if (storedBlogs && allBlogs) {
      const blogViews = JSON.parse(storedBlogs);
      let blogsData: BlogPost[] = JSON.parse(allBlogs);

      // Attach views to blogs
      blogsData = blogsData.map((blog) => ({
        ...blog,
        views: blogViews[blog._id] || 0, 
      }));

      // Sort blogs by views in descending order and pick top 8
      const topViewedBlogs = blogsData.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);

      setBlogs(topViewedBlogs);
    }
  }, []);

  return (
    <div className="mt-10 bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Top Most Viewed Blogs</h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => {
            const textContent = blog.content.find((item) => item.type === "text")?.data || "";
            const truncatedContent = textContent.split("\n")[0].slice(0, 60) + "...";

            return (
              <article key={blog._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform">
                <div className="h-32">
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 line-clamp-1">{blog.title}</h3>
                  <p className="text-xs text-gray-600">By: {blog.author.name} • {blog.views || 0} views</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{truncatedContent}</p>
                  <Link to={`/blog/${blog._id}`} className="text-blue-500 text-xs font-medium mt-2 inline-block">
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
