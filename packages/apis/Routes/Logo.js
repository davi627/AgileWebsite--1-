import express from 'express'
import multer from 'multer'
import Logo from '../Models/Logo.js'
import path from 'path'

const router = express.Router()

// Configure Multer for file uploads (logos)
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const uploadLogo = multer({ storage: logoStorage })

// Upload a logo
router.post(
  '/logo',
  uploadLogo.fields([{ name: 'bwLogo' }, { name: 'colorLogo' }]),
  async (req, res) => {
    try {
      const { name } = req.body
      const bwLogoUrl = `/uploads/logos/${req.files['bwLogo'][0].filename}`
      const colorLogoUrl = `/uploads/logos/${req.files['colorLogo'][0].filename}`

      // Save the logo details in the database
      const newLogo = new Logo({ name, bwLogoUrl, colorLogoUrl })
      await newLogo.save()

      res.status(201).json(newLogo)
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload logo', error })
    }
  }
)

// Get all logos
router.get('/logo', async (req, res) => {
  try {
    const logos = await Logo.find()
    res.status(200).json(logos)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logos', error })
  }
})

export { router as logoRouter }
