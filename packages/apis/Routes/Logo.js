import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Logo from '../Models/Logo.js'

const router = express.Router()

// Configure storage for uploaded logos
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('public', 'uploads', 'logos')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Helper function to construct full image URL
const constructImageUrl = (req, imagePath) => {
  if (!imagePath) return ''
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Construct full URL with protocol, host, and path
  const protocol = req.protocol
  const host = req.get('host')
  const baseUrl = `${protocol}://${host}`
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  return `${baseUrl}/${cleanPath}`
}

// Get all logos
router.get('/logo', async (req, res) => {
  try {
    const logos = await Logo.find()
    
    // Transform logos to include full image URLs
    const logosWithFullUrls = logos.map(logo => ({
      ...logo.toObject(),
      bwLogoUrl: constructImageUrl(req, logo.bwLogoUrl),
      colorLogoUrl: constructImageUrl(req, logo.colorLogoUrl)
    }))
    
    if (!logosWithFullUrls.length) {
      return res.status(404).json({ message: 'No logos found' })
    }
    
    res.status(200).json(logosWithFullUrls)
  } catch (err) {
    console.error('Error fetching logos:', err)
    res.status(500).json({ message: err.message })
  }
})

router.post('/logo', uploadLogo.fields([{ name: 'bwLogo' }, { name: 'colorLogo' }]), async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !req.files['bwLogo'] || !req.files['colorLogo']) {
      return res.status(400).json({ message: 'Name and both logo files (bwLogo and colorLogo) are required' })
    }

    const bwLogoUrl = `uploads/logos/${req.files['bwLogo'][0].filename}`
    const colorLogoUrl = `uploads/logos/${req.files['colorLogo'][0].filename}`

    // Save the logo details in the database
    const newLogo = new Logo({ name, bwLogoUrl, colorLogoUrl })
    const savedLogo = await newLogo.save()

    // Return logo with full image URLs
    const logoWithFullUrls = {
      ...savedLogo.toObject(),
      bwLogoUrl: constructImageUrl(req, savedLogo.bwLogoUrl),
      colorLogoUrl: constructImageUrl(req, savedLogo.colorLogoUrl)
    }

    res.status(201).json(logoWithFullUrls)
  } catch (err) {
    console.error('Error creating logo:', err)
    if (req.files['bwLogo']) fs.unlink(req.files['bwLogo'][0].path, () => {})
    if (req.files['colorLogo']) fs.unlink(req.files['colorLogo'][0].path, () => {})
    res.status(400).json({ message: err.message })
  }
})

router.put('/logo/:id', uploadLogo.fields([{ name: 'bwLogo' }, { name: 'colorLogo' }]), async (req, res) => {
  try {
    const { name } = req.body
    const existingLogo = await Logo.findById(req.params.id)
    if (!existingLogo) {
      return res.status(404).json({ message: 'Logo not found' })
    }

    let bwLogoUrl = existingLogo.bwLogoUrl
    let colorLogoUrl = existingLogo.colorLogoUrl

    if (req.files['bwLogo']) {
      bwLogoUrl = `uploads/logos/${req.files['bwLogo'][0].filename}`
      if (!existingLogo.bwLogoUrl.startsWith('http')) {
        const oldBwPath = path.join('public', existingLogo.bwLogoUrl)
        if (fs.existsSync(oldBwPath)) fs.unlink(oldBwPath, (err) => { if (err) console.error('Error deleting old bw logo:', err) })
      }
    }

    if (req.files['colorLogo']) {
      colorLogoUrl = `uploads/logos/${req.files['colorLogo'][0].filename}`
      if (!existingLogo.colorLogoUrl.startsWith('http')) {
        const oldColorPath = path.join('public', existingLogo.colorLogoUrl)
        if (fs.existsSync(oldColorPath)) fs.unlink(oldColorPath, (err) => { if (err) console.error('Error deleting old color logo:', err) })
      }
    }

    const updatedLogo = await Logo.findByIdAndUpdate(
      req.params.id,
      { name, bwLogoUrl, colorLogoUrl },
      { new: true }
    )

    const logoWithFullUrls = {
      ...updatedLogo.toObject(),
      bwLogoUrl: constructImageUrl(req, updatedLogo.bwLogoUrl),
      colorLogoUrl: constructImageUrl(req, updatedLogo.colorLogoUrl)
    }

    res.json(logoWithFullUrls)
  } catch (err) {
    console.error('Error updating logo:', err)
    if (req.files['bwLogo']) fs.unlink(req.files['bwLogo'][0].path, () => {})
    if (req.files['colorLogo']) fs.unlink(req.files['colorLogo'][0].path, () => {})
    res.status(400).json({ message: err.message })
  }
})

router.delete('/logo/:id', async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id)
    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' })
    }

    // Delete associated images if they exist and were uploaded (not URLs)
    if (logo.bwLogoUrl && !logo.bwLogoUrl.startsWith('http')) {
      const bwPath = path.join('public', logo.bwLogoUrl)
      if (fs.existsSync(bwPath)) fs.unlink(bwPath, (err) => { if (err) console.error('Error deleting bw logo:', err) })
    }
    if (logo.colorLogoUrl && !logo.colorLogoUrl.startsWith('http')) {
      const colorPath = path.join('public', logo.colorLogoUrl)
      if (fs.existsSync(colorPath)) fs.unlink(colorPath, (err) => { if (err) console.error('Error deleting color logo:', err) })
    }

    await Logo.findByIdAndDelete(req.params.id)
    res.json({ message: 'Logo deleted' })
  } catch (err) {
    console.error('Error deleting logo:', err)
    res.status(500).json({ message: err.message })
  }
})

export { router as logoRouter }