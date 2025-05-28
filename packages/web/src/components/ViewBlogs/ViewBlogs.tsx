import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000'

interface BlogContent {
  type: 'text' | 'image'
  data: string
}

interface Blog {
  _id: string
  title: string
  author: { name: string }
  content: BlogContent[]
}

const ViewBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentAction, setCurrentAction] = useState<() => void>(() => {})
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)
  const [isEditingBlog, setIsEditingBlog] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState<BlogContent[]>([])
  const [author, setAuthor] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const [editorHtml, setEditorHtml] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true
      })
    ],
    content: editorHtml,
    onUpdate: ({ editor }) => {
      setEditorHtml(editor.getHTML())
    }
  })

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
    setIsCreatingBlog(true)
    setIsEditingBlog(true)
    setEditingBlogId(blog._id)
    setTitle(blog.title)
    setAuthor(blog.author.name)
    setContent(blog.content)

    // Rebuild editor HTML from blog.content
    const html = blog.content
      .map((item) => {
        if (item.type === 'text') {
          return `<p>${item.data}</p>`
        } else if (item.type === 'image') {
          return `<img src="${item.data}" alt="Blog Image" />`
        }
        return ''
      })
      .join('')

    setEditorHtml(html)
    if (editor) {
      editor.commands.setContent(html)
    }

    // Set cover image URL if exists
    const coverImage = blog.content.find((item) => item.type === 'image')
    setCoverImageUrl(coverImage ? coverImage.data : '')
  }

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
      // Convert HTML to structured content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = editorHtml

      const plainText = tempDiv.innerText.trim()
      const images = Array.from(tempDiv.getElementsByTagName('img')).map(
        (img) => img.src
      )

      const blogContent: BlogContent[] = []

      if (plainText) {
        blogContent.push({ type: 'text', data: plainText })
      }

      images.forEach((src) => {
        blogContent.push({ type: 'image', data: src })
      })

      // Prepend cover image if available
      if (coverImageUrl) {
        blogContent.unshift({ type: 'image', data: coverImageUrl })
      }

      if (isEditingBlog && editingBlogId) {
        const response = await axios.put(
          `${API_BASE_URL}/blog/blogs/${editingBlogId}`,
          {
            title,
            content: blogContent,
            author: { name: author }
          }
        )

        if (response.status === 200) {
          alert('Blog updated successfully!')
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/blog/blogs`, {
          title,
          content: blogContent,
          author: { name: author }
        })

        if (response.status === 201) {
          alert('Blog created successfully!')
        }
      }

      // Reset form
      setTitle('')
      setContent([])
      setAuthor('')
      setCoverImageFile(null)
      setCoverImageUrl('')
      setEditorHtml('')
      if (editor) {
        editor.commands.clearContent()
      }
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

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">View Blogs</h2>
        <button
          onClick={() => {
            setIsCreatingBlog(!isCreatingBlog)
            setIsEditingBlog(false)
            setEditingBlogId(null)
            setTitle('')
            setContent([])
            setAuthor('')
            setEditorHtml('')
            if (editor) {
              editor.commands.clearContent()
            }
            setCoverImageFile(null)
            setCoverImageUrl('')
          }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200"
        >
          {isCreatingBlog ? 'Cancel' : 'Create'}
        </button>
      </div>

      {isCreatingBlog && (
        <div className="mb-8 border-b pb-8">
          <h2 className="text-2xl font-bold mb-6">
            {isEditingBlog ? 'Update Blog' : 'Create Blog'}
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
                  alt="Cover"
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
              <div className="border rounded p-2 min-h-[16rem]">
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${
                      editor?.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${
                      editor?.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`p-2 rounded ${
                      editor?.isActive('bulletList') ? 'bg-gray-200' : ''
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUploadInEditor}
                    className="p-2 rounded"
                  >
                    Image
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className="min-h-[12rem] border-t pt-2"
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
              className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-md transition duration-200"
            >
              {loading ? 'Submitting...' : isEditingBlog ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Display blogs here */}
      <div>
        {blogs.map((blog) => (
          <div key={blog._id} className="border-b py-4">
            <h3 className="text-lg font-semibold">{blog.title}</h3>
            <p className="text-sm text-gray-500">By {blog.author.name}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md">
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
