import React, { useState } from 'react'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    logo: File | null
    description: string
    author: string
    products: string[]
  }) => void
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [logo, setLogo] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [products, setProducts] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert the products string to an array
    const productsArray = products.split(',').map((product) => product.trim())

    // Pass the data to the onSubmit function
    onSubmit({ logo, description, author, products: productsArray })

    // Clear the form fields
    setLogo(null)
    setDescription('')
    setAuthor('')
    setProducts('')

    // Close the modal
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company's Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Products
            </label>
            <textarea
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter products (comma-separated)"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentModal
