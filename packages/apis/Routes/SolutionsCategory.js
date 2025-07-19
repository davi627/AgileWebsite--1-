import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import SolutionCategory from '../Models/Solutions.js';

const router = express.Router();

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Helper function to construct full image URL
const constructImageUrl = (req, imagePath) => {
  if (!imagePath) return '';

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${baseUrl}/${cleanPath}`;
};

// Get all solution categories
router.get('/', async (req, res) => {
  try {
    const categories = await SolutionCategory.find();
    const categoriesWithFullUrls = categories.map((category) => ({
      ...category.toObject(),
      imageUrl: constructImageUrl(req, category.imageUrl),
    }));
    res.json(categoriesWithFullUrls);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single solution category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await SolutionCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryWithFullUrl = {
      ...category.toObject(),
      imageUrl: constructImageUrl(req, category.imageUrl),
    };

    res.json(categoryWithFullUrl);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST, PUT, DELETE routes remain unchanged
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, solutions } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const category = new SolutionCategory({
      title,
      imageUrl,
      description: description || 'Explore our comprehensive solutions designed to meet your specific business needs.',
      solutions: JSON.parse(solutions),
    });

    const newCategory = await category.save();
    const categoryWithFullUrl = {
      ...newCategory.toObject(),
      imageUrl: constructImageUrl(req, newCategory.imageUrl),
    };

    res.status(201).json(categoryWithFullUrl);
  } catch (err) {
    console.error('Error creating category:', err);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, solutions } = req.body;
    let imageUrl = req.body.existingImageUrl || '';

    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
      if (req.body.existingImageUrl && !req.body.existingImageUrl.startsWith('http')) {
        const oldImagePath = path.join('public', req.body.existingImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old image:', err);
          });
        }
      }
    }

    const updatedCategory = await SolutionCategory.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageUrl,
        description: description || 'Explore our comprehensive solutions designed to meet your specific business needs.',
        solutions: JSON.parse(solutions),
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryWithFullUrl = {
      ...updatedCategory.toObject(),
      imageUrl: constructImageUrl(req, updatedCategory.imageUrl),
    };

    res.json(categoryWithFullUrl);
  } catch (err) {
    console.error('Error updating category:', err);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await SolutionCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.imageUrl && !category.imageUrl.startsWith('http')) {
      const imagePath = path.join('public', category.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image:', err);
        });
      }
    }

    await SolutionCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Solution category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: err.message });
  }
});

export { router as solutionCategoriesRouter };