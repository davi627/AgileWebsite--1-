// routes/logoRoutes.js
import express from 'express';
import multer from 'multer';
import Logo from '../Models/Logo.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

// Upload a logo
router.post('/logo', upload.fields([{ name: 'bwLogo' }, { name: 'colorLogo' }]), async (req, res) => {
  try {
    const { name } = req.body;
    const bwLogoUrl = `/logos/${req.files['bwLogo'][0].filename}`;
    const colorLogoUrl = `/logos/${req.files['colorLogo'][0].filename}`;

    // Save the logo details in the database
    const newLogo = new Logo({ name, bwLogoUrl, colorLogoUrl });
    await newLogo.save();

    res.status(201).json(newLogo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload logo', error });
  }
});

// Get all logos
router.get('/logo', async (req, res) => {
  try {
    const logos = await Logo.find();
    res.status(200).json(logos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logos', error });
  }
});

export {router as logoRouter}