import React, { useEffect, useState } from 'react';

// Define the interface for blog posts
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  datetime: string;
  formattedDate: string;
  author: {
    name: string;
  };
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from the backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/blog/blogs');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: BlogPost[] = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-20 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-medium">Our Recent News</h1>
          <p className="mt-2 text-gray-700">
            Everything that is trending in the tech just for you.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-40 overflow-hidden"> 
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4"> 
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  <a href={blog.href} className="hover:text-indigo-600">
                    {blog.title}
                  </a>
                </h3>
                <time
                  dateTime={blog.datetime}
                  className="mt-1 text-xs text-gray-500" 
                >
                  {blog.formattedDate}
                </time>
                <p className="mt-2 text-xs text-gray-600 line-clamp-3"> 
                  {blog.description}
                </p>
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-900"> 
                    By {blog.author.name}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;