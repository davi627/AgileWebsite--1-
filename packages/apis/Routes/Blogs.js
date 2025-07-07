import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Blogs from '../Models/Blogs.js'
import Comments from '../Models/Comments.js'
import mongoose from 'mongoose'

const router = express.Router()

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('public', 'uploads', 'blogs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// Helper function to construct full image URL
const constructImageUrl = (req, imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const protocol = req.protocol
  const host = req.get('host')
  const baseUrl = `${protocol}://${host}`
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${baseUrl}/${cleanPath}`
}

// Endpoint to handle image uploads
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const imageUrl = `/uploads/blogs/${req.file.filename}`
  res.json({ imageUrl: constructImageUrl(req, imageUrl) })
})

// Create new blog post
router.post('/blogs', async (req, res) => {
  const { title, content, author, imageUrl } = req.body

  // Validate content structure
  if (!Array.isArray(content)) {
    return res.status(400).json({ message: 'Content must be an array' })
  }

  for (const item of content) {
    if (!item.type || !item.data) {
      return res
        .status(400)
        .json({ message: 'Each content item must have a type and data' })
    }
  }

  try {
    const newBlog = new Blogs({
      title,
      content,
      imageUrl,
      author: { name: author.name }
    })

    const savedBlog = await newBlog.save()
    const blogWithFullUrls = {
      ...savedBlog.toObject(),
      imageUrl: constructImageUrl(req, savedBlog.imageUrl)
    }
    res.status(201).json(blogWithFullUrls)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all blog posts
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({ date: -1 })
    const blogsWithFullUrls = blogs.map(blog => ({
      ...blog.toObject(),
      imageUrl: constructImageUrl(req, blog.imageUrl)
    }))
    res.json(blogsWithFullUrls)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/blogs/top', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 8) // Max limit of 8
    const blogs = await Blogs.find().sort({ views: -1 }).limit(limit)
    const blogsWithFullUrls = blogs.map(blog => ({
      ...blog.toObject(),
      imageUrl: constructImageUrl(req, blog.imageUrl)
    }))
    res.json(blogsWithFullUrls)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single blog post by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    const blogWithFullUrl = {
      ...blog.toObject(),
      imageUrl: constructImageUrl(req, blog.imageUrl)
    }
    res.json(blogWithFullUrl)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Increment views for a blog
router.patch('/blogs/:id/view', async (req, res) => {
  try {
    const blog = await Blogs.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    const blogWithFullUrl = {
      ...blog.toObject(),
      imageUrl: constructImageUrl(req, blog.imageUrl)
    }
    res.json(blogWithFullUrl)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get approved comments for a blog
router.get('/blogs/:id/comments', async (req, res) => {
  try {
    const comments = await Comments.find({
      blogId: req.params.id,
      status: 'approved'
    }).sort({ date: -1 })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add comment (goes to pending)
router.post('/blogs/:id/comments', async (req, res) => {
  const { text, author } = req.body
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid blog ID' })
  }

  try {
    const newComment = new Comments({
      text,
      author,
      blogId: id,
      status: 'pending',
      date: req.body.date || new Date()
    })

    const savedComment = await newComment.save()
    res.status(201).json(savedComment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Admin routes for moderation
router.get('/comments/pending', async (req, res) => {
  try {
    const comments = await Comments.find({ status: 'pending' })
      .populate('blogId', 'title')
      .sort({ date: -1 })
      .lean()

    const formattedComments = comments.map((comment) => {
      let formattedDate
      try {
        formattedDate = comment.date
          ? new Date(comment.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'No date'
      } catch (e) {
        formattedDate = 'Invalid date'
      }

      return {
        ...comment,
        formattedDate
      }
    })

    res.json(formattedComments)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch comments',
      error: error.message
    })
  }
})

router.get('/comments/approved', async (req, res) => {
  try {
    const comments = await Comments.find({ status: 'approved' })
      .populate('blogId', 'title')
      .sort({ date: -1 })
      .lean()

    const formattedComments = comments.map((comment) => {
      let formattedDate
      try {
        formattedDate = comment.date
          ? new Date(comment.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'No date'
      } catch (e) {
        formattedDate = 'Invalid date'
      }

      return {
        ...comment,
        formattedDate
      }
    })

    res.json(formattedComments)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch approved comments',
      error: error.message
    })
  }
})

router.patch('/comments/:id/approve', async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    res.json(comment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/comments/:id/reject', async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
    res.json(comment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a blog post
router.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid blog ID format' })
  }

  try {
    const blog = await Blogs.findById(id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    if (blog.imageUrl && !blog.imageUrl.startsWith('http')) {
      const imagePath = path.join('public', blog.imageUrl)
      if (fs.existsSync(imagePath)) fs.unlink(imagePath, (err) => { if (err) console.error('Error deleting image:', err) })
    }
    await Blogs.findByIdAndDelete(id)
    res.status(200).json({ message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Blog', error: error.message })
  }
})

// Update an existing blog post
router.put('/blogs/:id', async (req, res) => {
  const { id } = req.params
  const { title, content, author, imageUrl } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid blog ID' })
  }

  if (content && !Array.isArray(content)) {
    return res.status(400).json({ message: 'Content must be an array' })
  }

  if (content) {
    for (const item of content) {
      if (!item.type || !item.data) {
        return res.status(400).json({
          message: 'Each content item must have a type and data'
        })
      }
    }
  }

  try {
    const updatedBlog = await Blogs.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(imageUrl && { imageUrl }),
        ...(author?.name && { author: { name: author.name } })
      },
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    const blogWithFullUrl = {
      ...updatedBlog.toObject(),
      imageUrl: constructImageUrl(req, updatedBlog.imageUrl)
    }
    res.json(blogWithFullUrl)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog', error: error.message })
  }
})

export { router as BlogsRouter }