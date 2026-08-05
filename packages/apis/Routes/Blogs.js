import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Blogs from '../Models/Blogs.js'
import Comments from '../Models/Comments.js'
import mongoose from 'mongoose'
import { constructPublicUrl } from '../utils/publicUrl.js'
import {
  findBlogByIdOrSlug,
  generateUniqueSlug,
  ensureBlogSlugs
} from '../utils/blogSlug.js'

const router = express.Router()

function formatBlog(req, blog) {
  return {
    ...blog.toObject(),
    imageUrl: constructPublicUrl(req, blog.imageUrl)
  }
}

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

// Endpoint to handle image uploads
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const imageUrl = `/uploads/blogs/${req.file.filename}`
  res.json({ imageUrl: constructPublicUrl(req, imageUrl) })
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
    const slug = await generateUniqueSlug(title)
    const newBlog = new Blogs({
      title,
      slug,
      content,
      imageUrl,
      author: { name: author.name }
    })

    const savedBlog = await newBlog.save()
    res.status(201).json(formatBlog(req, savedBlog))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all blog posts
router.get('/blogs', async (req, res) => {
  try {
    let blogs = await Blogs.find().sort({ date: -1 })
    blogs = await ensureBlogSlugs(blogs)
    res.json(blogs.map((blog) => formatBlog(req, blog)))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/blogs/top', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 8) // Max limit of 8
    let blogs = await Blogs.find().sort({ views: -1 }).limit(limit)
    blogs = await ensureBlogSlugs(blogs)
    res.json(blogs.map((blog) => formatBlog(req, blog)))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single blog post by slug or legacy ID
router.get('/blogs/:id', async (req, res) => {
  try {
    let blog = await findBlogByIdOrSlug(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    if (!blog.slug) {
      blog.slug = await generateUniqueSlug(blog.title, blog._id)
      await blog.save()
    }

    res.json(formatBlog(req, blog))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Increment views for a blog
router.patch('/blogs/:id/view', async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    blog.views = (blog.views || 0) + 1
    await blog.save()

    res.json(formatBlog(req, blog))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get approved comments for a blog
router.get('/blogs/:id/comments', async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    const comments = await Comments.find({
      blogId: blog._id,
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

  try {
    const blog = await findBlogByIdOrSlug(id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    const newComment = new Comments({
      text,
      author,
      blogId: blog._id,
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
    const update = {
      ...(content && { content }),
      ...(imageUrl && { imageUrl }),
      ...(author?.name && { author: { name: author.name } })
    }

    if (title) {
      update.title = title
      update.slug = await generateUniqueSlug(title, id)
    }

    const updatedBlog = await Blogs.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    res.json(formatBlog(req, updatedBlog))
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog', error: error.message })
  }
})

export { router as BlogsRouter }