import express from 'express'
import Comment from '../Models/Comment.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// Configure Multer for file uploads (comments)
const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('public', 'uploads', 'comments')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const uploadCommentFiles = multer({ storage: commentStorage }).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 }
])

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

// Get all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 })
    const commentsWithFullUrls = comments.map(comment => ({
      ...comment.toObject(),
      logo: constructImageUrl(req, comment.logo),
      image: constructImageUrl(req, comment.image)
    }))
    res.json(commentsWithFullUrls)
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ message: error.message })
  }
})

// Create new comment
router.post('/comments', uploadCommentFiles, async (req, res) => {
  const { description, author, products } = req.body
  let logo = null
  let image = null

  if (req.files['logo']) {
    logo = `/uploads/comments/${req.files['logo'][0].filename}`
  }
  if (req.files['image']) {
    image = `/uploads/comments/${req.files['image'][0].filename}`
  }

  try {
    // Debug the raw products value
    console.log('Raw products value:', products)

    // Safely parse products, default to empty array if invalid
    let parsedProducts = []
    if (products) {
      try {
        parsedProducts = JSON.parse(products)
        if (!Array.isArray(parsedProducts)) {
          throw new Error('Products must be an array')
        }
      } catch (parseError) {
        console.error('Invalid JSON for products:', parseError.message)
        parsedProducts = [] 
      }
    }

    const newComment = new Comment({
      logo,
      description: description || '',
      author: author || '',
      products: parsedProducts,
      image,
      status: 'pending' // Default status
    })

    const savedComment = await newComment.save()
    const commentWithFullUrls = {
      ...savedComment.toObject(),
      logo: constructImageUrl(req, savedComment.logo),
      image: constructImageUrl(req, savedComment.image)
    }
    res.status(201).json(commentWithFullUrls)
  } catch (error) {
    console.error('Error creating comment:', error)
    if (req.files['logo']) fs.unlink(req.files['logo'][0].path, () => {})
    if (req.files['image']) fs.unlink(req.files['image'][0].path, () => {})
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
    if (!comment) return res.status(404).json({ message: 'Comment not found' })
    const commentWithFullUrls = {
      ...comment.toObject(),
      logo: constructImageUrl(req, comment.logo),
      image: constructImageUrl(req, comment.image)
    }
    res.json(commentWithFullUrls)
  } catch (error) {
    console.error('Error approving comment:', error)
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
    if (!comment) return res.status(404).json({ message: 'Comment not found' })
    const commentWithFullUrls = {
      ...comment.toObject(),
      logo: constructImageUrl(req, comment.logo),
      image: constructImageUrl(req, comment.image)
    }
    res.json(commentWithFullUrls)
  } catch (error) {
    console.error('Error rejecting comment:', error)
    res.status(500).json({ message: error.message })
  }
})

router.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    if (comment.logo && !comment.logo.startsWith('http')) {
      const logoPath = path.join('public', comment.logo)
      if (fs.existsSync(logoPath)) fs.unlink(logoPath, (err) => { if (err) console.error('Error deleting logo:', err) })
    }
    if (comment.image && !comment.image.startsWith('http')) {
      const imagePath = path.join('public', comment.image)
      if (fs.existsSync(imagePath)) fs.unlink(imagePath, (err) => { if (err) console.error('Error deleting image:', err) })
    }
    await Comment.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(500).json({ message: error.message })
  }
})

export { router as CommentRouter }