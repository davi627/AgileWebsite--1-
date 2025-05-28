import express from 'express'
import Comment from '../Models/Comment.js'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// Configure Multer for file uploads (comments)
const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comments/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const uploadCommentFiles = multer({ storage: commentStorage }).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 }
])

// Get all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new comment
router.post('/comments', uploadCommentFiles, async (req, res) => {
  const { description, author, products } = req.body
  const logo = req.files['logo']
    ? `/uploads/comments/${req.files['logo'][0].filename}`
    : null
  const image = req.files['image']
    ? `/uploads/comments/${req.files['image'][0].filename}`
    : null

  try {
    const newComment = new Comment({
      logo,
      description,
      author,
      products,
      image
    })

    const savedComment = await newComment.save()
    res.status(201).json(savedComment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Approve a comment
router.put('/comments/:id/approve', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    res.json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reject a comment
router.put('/comments/:id/reject', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
    res.json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { router as CommentRouter }
