import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface BlogContent {
  type: "text" | "image";
  data: string;
}

interface Blog {
  _id: string;
  title: string;
  author: { name: string };
  content: BlogContent[];
}

const ViewBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentAction, setCurrentAction] = useState<() => void>(() => {});
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<BlogContent[]>([]);
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [editorHtml, setEditorHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: editorHtml,
    onUpdate: ({ editor }) => {
      setEditorHtml(editor.getHTML());
    },
  });

  const handleWithConfirmation = (action: () => void) => {
    setCurrentAction(() => action);
    setShowConfirmation(true);
  };

  const executeAction = () => {
    setShowConfirmation(false);
    currentAction();
  };

  const cancelAction = () => {
    setShowConfirmation(false);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      alert('Failed to fetch blogs. Please try again.');
    }
  };

  const handleDelete = async (blogId: string) => {
    handleWithConfirmation(async () => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/blog/blogs/${blogId}`);
        if (response.status === 200) {
          alert('Blog deleted successfully!');
          fetchBlogs();
        }
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    });
  };

  const handleEdit = (blog: Blog) => {
    setIsCreatingBlog(true);
    setIsEditingBlog(true);
    setEditingBlogId(blog._id);
    setTitle(blog.title);
    setAuthor(blog.author.name);
    setContent(blog.content);

    // Rebuild editor HTML from blog.content
    const html = blog.content.map(item => {
      if (item.type === 'text') {
        return `<p>${item.data}</p>`;
      } else if (item.type === 'image') {
        return `<img src="${item.data}" alt="Blog Image" />`;
      }
      return '';
    }).join('');

    setEditorHtml(html);
    if (editor) {
      editor.commands.setContent(html);
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          setLoading(true);
          const response = await axios.post(`${API_BASE_URL}/blog/upload-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data.imageUrl && editor) {
            editor.commands.setImage({ src: response.data.imageUrl });
          }
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert('Image upload failed.');
        } finally {
          setLoading(false);
        }
      }
    };
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorHtml;

      const plainText = tempDiv.innerText.trim();
      const images = Array.from(tempDiv.getElementsByTagName('img')).map(img => img.src);

      const blogContent: BlogContent[] = [];

      if (plainText) {
        blogContent.push({ type: 'text', data: plainText });
      }

      images.forEach(src => {
        blogContent.push({ type: 'image', data: src });
      });

      if (isEditingBlog && editingBlogId) {
        // Update existing blog
        const response = await axios.put(`${API_BASE_URL}/blog/blogs/${editingBlogId}`, {
          title,
          content: blogContent,
          author: { name: author },
          imageUrl,
        });

        if (response.status === 200) {
          alert('Blog updated successfully!');
        }
      } else {
        // Create new blog
        const response = await axios.post(`${API_BASE_URL}/blog/blogs`, {
          title,
          content: blogContent,
          author: { name: author },
          imageUrl,
        });

        if (response.status === 201) {
          alert('Blog created successfully!');
        }
      }

      // Reset form
      setTitle('');
      setContent([]);
      setAuthor('');
      setImageUrl('');
      setEditorHtml('');
      if (editor) {
        editor.commands.clearContent();
      }
      setIsCreatingBlog(false);
      setIsEditingBlog(false);
      setEditingBlogId(null);

      fetchBlogs();

    } catch (error) {
      console.error('Failed to submit blog:', error);
      alert('Failed to submit blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">View Blogs</h2>
        <button
          onClick={() => {
            setIsCreatingBlog(!isCreatingBlog);
            setIsEditingBlog(false);
            setEditingBlogId(null);
            setTitle('');
            setContent([]);
            setAuthor('');
            setEditorHtml('');
            if (editor) {
              editor.commands.clearContent();
            }
            setImageUrl('');
          }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200"
        >
          {isCreatingBlog ? 'Cancel' : 'Create'}
        </button>
      </div>

      {isCreatingBlog && (
        <div className="mb-8 border-b pb-8">
          <h2 className="text-2xl font-bold mb-6">{isEditingBlog ? 'Update Blog' : 'Create Blog'}</h2>
          <form onSubmit={handleBlogSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL (Cover i.e the image that appears on top of the blog)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="border rounded p-2 min-h-[16rem]">
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="p-2 rounded"
                  >
                    Image
                  </button>
                </div>
                <EditorContent editor={editor} className="min-h-[12rem] border-t pt-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
            >
              {loading ? (isEditingBlog ? "Updating..." : "Creating...") : (isEditingBlog ? "Update Blog" : "Create Blog")}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {blogs.length === 0 ? (
          <p className="text-gray-700">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
              <div>
                <h3 className="font-bold">{blog.title}</h3>
                <p className="text-sm text-gray-600">By {blog.author.name}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelAction} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={executeAction} className="px-4 py-2 bg-red-500 text-white rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBlogs;