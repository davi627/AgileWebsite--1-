import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import SolutionCategory from '../Models/Solutions.js';

const router = express.Router()

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Get all solution categories
router.get('/', async (req, res) => {
  try {
    const categories = await SolutionCategory.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a new solution category (with file upload support)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, solutions } = req.body
    let imageUrl = ''

    if (req.file) {
      // If file was uploaded, use its path
      imageUrl = `/uploads/${req.file.filename}`
    } else if (req.body.imageUrl) {
      // Fallback to direct URL if provided
      imageUrl = req.body.imageUrl
    }

    const category = new SolutionCategory({
      title,
      imageUrl,
      solutions: JSON.parse(solutions)
    })

    const newCategory = await category.save()
    res.status(201).json(newCategory)
  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlink(req.file.path, () => {})
    }
    res.status(400).json({ message: err.message })
  }
})

// Update a solution category (with file upload support)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, solutions } = req.body
    let imageUrl = req.body.existingImageUrl || ''

    if (req.file) {
      // If new file was uploaded
      imageUrl = `/uploads/${req.file.filename}`

      // Delete old image if it exists and was uploaded (not a URL)
      if (
        req.body.existingImageUrl &&
        !req.body.existingImageUrl.startsWith('http')
      ) {
        const oldImagePath = path.join('public', req.body.existingImageUrl)
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, () => {})
        }
      }
    }

    const updatedCategory = await SolutionCategory.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageUrl,
        solutions: JSON.parse(solutions)
      },
      { new: true }
    )

    res.json(updatedCategory)
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, () => {})
    }
    res.status(400).json({ message: err.message })
  }
})

// Delete a solution category (with image cleanup)
router.delete('/:id', async (req, res) => {
  try {
    const category = await SolutionCategory.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    // Delete associated image if it exists and was uploaded (not a URL)
    if (category.imageUrl && !category.imageUrl.startsWith('http')) {
      const imagePath = path.join('public', category.imageUrl)
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, () => {})
      }
    }

    await SolutionCategory.findByIdAndDelete(req.params.id)
    res.json({ message: 'Solution category deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export { router as solutionCategoriesRouter }
