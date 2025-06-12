import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000'

interface BlogContent {
  type: 'text' | 'image'
  data: string
}

interface Blog {
  _id: string
  title: string
  imageUrl: string
  author: { name: string }
  content: BlogContent[]
  createdAt: string
}

const ViewBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentAction, setCurrentAction] = useState<() => void>(() => {})
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)
  const [isEditingBlog, setIsEditingBlog] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState<BlogContent[]>([])
  const [author, setAuthor] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5 my-2',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'mx-auto my-4 rounded-lg max-w-full h-auto block',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-4 min-h-[200px] max-w-none',
      },
    },
  });

  const handleWithConfirmation = (action: () => void) => {
    setCurrentAction(() => action)
    setShowConfirmation(true)
  }

  const executeAction = () => {
    setShowConfirmation(false)
    currentAction()
  }

  const cancelAction = () => {
    setShowConfirmation(false)
  }

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/blogs`)
      setBlogs(response.data)
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
      alert('Failed to fetch blogs. Please try again.')
    }
  }

  const handleDelete = async (blogId: string) => {
    handleWithConfirmation(async () => {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/blog/blogs/${blogId}`
        )
        if (response.status === 200) {
          alert('Blog deleted successfully!')
          fetchBlogs()
        }
      } catch (error) {
        console.error('Failed to delete blog:', error)
        alert('Failed to delete blog. Please try again.')
      }
    })
  }

  const handleEdit = (blog: Blog) => {
    setIsCreatingBlog(true);
    setIsEditingBlog(true);
    setEditingBlogId(blog._id);
    setTitle(blog.title);
    setAuthor(blog.author.name);
    setContent(blog.content);
    setCoverImageUrl(blog.imageUrl || '');

    let htmlContent = '';
    blog.content.forEach((item) => {
      if (item.type === 'text') {
        htmlContent += item.data;
      } else if (item.type === 'image') {
        htmlContent += `<img src="${item.data}" alt="Blog Image" class="mx-auto my-4 rounded-lg max-w-full h-auto block" />`;
      }
    });

    if (editor) {
      editor.commands.setContent(htmlContent);
    }
  };

  const handleImageUploadInEditor = async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('image', file)

        try {
          setLoading(true)
          const response = await axios.post(
            `${API_BASE_URL}/blog/upload-image`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          )

          if (response.data.imageUrl && editor) {
            editor.commands.setImage({ src: response.data.imageUrl })
          }
        } catch (error) {
          console.error('Failed to upload image:', error)
          alert('Image upload failed.')
        } finally {
          setLoading(false)
        }
      }
    }
  }

  const handleCoverImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      setLoading(true)
      const response = await axios.post(
        `${API_BASE_URL}/blog/upload-image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.data.imageUrl) {
        setCoverImageUrl(response.data.imageUrl)
      }
    } catch (error) {
      console.error('Failed to upload cover image:', error)
      alert('Cover image upload failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const html = editor?.getHTML() || ''

      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html

      const images = Array.from(tempDiv.getElementsByTagName('img'))
      const blogContent: BlogContent[] = []

      images.forEach(img => img.remove())

      const textContent = tempDiv.innerHTML.trim()

      if (textContent) {
        blogContent.push({ type: 'text', data: textContent })
      }

      images.forEach((img) => {
        blogContent.push({ type: 'image', data: img.src })
      })

      const blogData = {
        title,
        content: blogContent,
        author: { name: author },
        imageUrl: coverImageUrl
      }

      if (isEditingBlog && editingBlogId) {
        const response = await axios.put(
          `${API_BASE_URL}/blog/blogs/${editingBlogId}`,
          blogData
        )

        if (response.status === 200) {
          alert('Blog updated successfully!')
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/blog/blogs`,
          blogData
        )

        if (response.status === 201) {
          alert('Blog created successfully!')
        }
      }

      setTitle('')
      setContent([])
      setAuthor('')
      setCoverImageFile(null)
      setCoverImageUrl('')
      editor?.commands.clearContent()
      setIsCreatingBlog(false)
      setIsEditingBlog(false)
      setEditingBlogId(null)

      fetchBlogs()
    } catch (error) {
      console.error('Failed to submit blog:', error)
      alert('Failed to submit blog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderBlogContent = (content: BlogContent[]) => {
    return content.map((item, index) => {
      if (item.type === 'text') {
        const hasHtmlTags = /<[^>]*>/g.test(item.data);

        if (hasHtmlTags) {
          return (
            <div
              key={index}
              className="prose max-w-none [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_li]:mb-1 [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: item.data }}
            />
          )
        } else {
          return (
            <div key={index} className="text-gray-700 mb-2">
              {item.data}
            </div>
          )
        }
      } else if (item.type === 'image') {
        return (
          <img
            key={index}
            src={item.data}
            alt="Blog Image"
            className="mx-auto my-2 rounded-lg max-w-full h-auto block"
          />
        )
      }
      return null
    })
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">View Blogs</h2>
        <button
          onClick={() => {
            setIsCreatingBlog(!isCreatingBlog)
            setIsEditingBlog(false)
            setEditingBlogId(null)
            setTitle('')
            setContent([])
            setAuthor('')
            editor?.commands.clearContent()
            setCoverImageFile(null)
            setCoverImageUrl('')
          }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
        >
          {isCreatingBlog ? 'Cancel' : 'Create New Blog'}
        </button>
      </div>

      {isCreatingBlog && (
        <div className="mb-8 border-b pb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            {isEditingBlog ? 'Update Blog' : 'Create New Blog'}
          </h2>
          <form onSubmit={handleBlogSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0]
                    setCoverImageFile(file)
                    handleCoverImageUpload(file)
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-700"
                required={!isEditingBlog}
              />
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="Cover Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="border rounded-lg overflow-hidden">
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editor?.isActive('bold')
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editor?.isActive('italic')
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editor?.isActive('underline')
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                    title="Underline"
                  >
                    <u>U</u>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editor?.isActive('bulletList')
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editor?.isActive('orderedList')
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                    title="Numbered List"
                  >
                    1. List
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUploadInEditor}
                    className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border transition-colors"
                    title="Insert Image"
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : '📷 Image'}
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className="min-h-[200px] p-4 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author Name
              </label>
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
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : isEditingBlog ? 'Update Blog' : 'Create Blog'}
            </button>
          </form>
        </div>
      )}

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt="Blog Cover"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">By {blog.author.name}</p>
              <p className="text-xs text-gray-500 mb-4">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>

              {/* Blog Content Preview */}
              <div className="mb-4 text-sm text-gray-700 max-h-20 overflow-hidden">
                <div className="line-clamp-3">
                  {renderBlogContent(blog.content.slice(0, 1))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewingBlog(blog)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex-1"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog View Modal */}
      {viewingBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{viewingBlog.title}</h2>
              <button
                onClick={() => setViewingBlog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {viewingBlog.imageUrl && (
              <img
                src={viewingBlog.imageUrl}
                alt="Blog Cover"
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
            )}

            <p className="text-sm text-gray-600 mb-4">By {viewingBlog.author.name}</p>
            <p className="text-xs text-gray-500 mb-6">
              {new Date(viewingBlog.createdAt).toLocaleDateString()}
            </p>

            <div className="prose max-w-none">
              {renderBlogContent(viewingBlog.content)}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full mx-4">
            <p>Are you sure you want to proceed?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={executeAction}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelAction}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewBlogs
