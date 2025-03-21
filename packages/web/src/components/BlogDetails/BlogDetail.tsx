import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  formattedDate: string;
  author: {
    name: string;
  };
}

interface Comment {
  _id: string;
  text: string;
  author: string;
  date: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Fetch the blog post and its comments
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blog/blogs/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: BlogPost = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blog/${id}/comments`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/blog/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment, author: 'Anonymous' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Comment = await response.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!blog) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="mt-20 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Blog Content */}
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <time dateTime={blog.formattedDate} className="text-sm text-gray-500">
            {blog.formattedDate}
          </time>
          <p className="text-sm text-gray-900">By {blog.author.name}</p>
          <div className="mt-4">
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto" />
          </div>
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </article>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Write a comment..."
              required
            />
            <button
              type="submit"
              className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-200"
            >
              Submit Comment
            </button>
          </form>

          {/* Display Comments */}
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-4 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">{comment.text}</p>
                <p className="text-xs text-gray-500">By {comment.author} on {new Date(comment.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;