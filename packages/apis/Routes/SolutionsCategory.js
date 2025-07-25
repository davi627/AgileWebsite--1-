
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

// Allow multiple image uploads: one for category, one for section, and multiple for solutions
const uploadFields = upload.fields([
  { name: 'categoryImage', maxCount: 1 },
  { name: 'sectionImage', maxCount: 1 },
  { name: 'solutionImages', maxCount: 10 },
]);

// Helper function to construct full image URL
const constructImageUrl = (req, imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

// Middleware to catch invalid data:image requests
router.use((req, res, next) => {
  if (req.originalUrl.startsWith('/data:image')) {
    console.warn(`Invalid request for base64 image URL: ${req.originalUrl}`);
    return res.status(400).json({ message: 'Invalid request: Base64 image URLs should not be fetched from the server' });
  }
  next();
});

// Get all solution categories
router.get('/', async (req, res) => {
  try {
    const categories = await SolutionCategory.find();
    const categoriesWithFullUrls = categories.map((category) => ({
      ...category.toObject(),
      imageUrl: constructImageUrl(req, category.imageUrl),
      sectionImageUrl: constructImageUrl(req, category.sectionImageUrl),
      solutions: category.solutions.map((solution) => ({
        ...solution.toObject(),
        imageUrl: constructImageUrl(req, solution.imageUrl),
      })),
    }));
    res.json(categoriesWithFullUrls);
  } catch (err) {
    console.error('Error fetching categories:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
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
      sectionImageUrl: constructImageUrl(req, category.sectionImageUrl),
      solutions: category.solutions.map((solution) => ({
        ...solution.toObject(),
        imageUrl: constructImageUrl(req, solution.imageUrl),
      })),
    };
    res.json(categoryWithFullUrl);
  } catch (err) {
    console.error('Error fetching category:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Create a new solution category
router.post('/', uploadFields, async (req, res) => {
  try {
    const { title, description, solutions, existingCategoryImageUrl, existingSectionImageUrl } = req.body;
    // Validate existing image URLs
    if (existingCategoryImageUrl?.startsWith('data:') || existingSectionImageUrl?.startsWith('data:')) {
      return res.status(400).json({ message: 'Base64 images are not supported for existing image URLs' });
    }

    let parsedSolutions = JSON.parse(solutions || '[]');
    let categoryImageUrl = existingCategoryImageUrl || '';
    let sectionImageUrl = existingSectionImageUrl || '';

    // Handle category image
    if (req.files && req.files['categoryImage']) {
      categoryImageUrl = `uploads/${req.files['categoryImage'][0].filename}`;
    }

    // Handle section image
    if (req.files && req.files['sectionImage']) {
      sectionImageUrl = `uploads/${req.files['sectionImage'][0].filename}`;
    }

    // Handle solution images
    const solutionImages = req.files && req.files['solutionImages'] ? req.files['solutionImages'] : [];
    parsedSolutions = parsedSolutions.map((solution, index) => ({
      ...solution,
      imageUrl: solutionImages[index]
        ? `uploads/${solutionImages[index].filename}`
        : req.body[`existingSolutionImageUrl[${index}]`] || solution.imageUrl || '',
    }));

    // Validate solution image URLs
    for (const [index, solution] of parsedSolutions.entries()) {
      if (solution.imageUrl?.startsWith('data:')) {
        return res.status(400).json({ message: `Base64 images are not supported for solution ${index + 1} image URL` });
      }
    }

    const category = new SolutionCategory({
      title,
      imageUrl: categoryImageUrl,
      sectionImageUrl,
      description: description || 'Explore our comprehensive solutions designed to meet your specific business needs.',
      solutions: parsedSolutions,
    });

    const newCategory = await category.save();
    const categoryWithFullUrl = {
      ...newCategory.toObject(),
      imageUrl: constructImageUrl(req, newCategory.imageUrl),
      sectionImageUrl: constructImageUrl(req, newCategory.sectionImageUrl),
      solutions: newCategory.solutions.map((solution) => ({
        ...solution.toObject(),
        imageUrl: constructImageUrl(req, solution.imageUrl),
      })),
    };

    res.status(201).json(categoryWithFullUrl);
  } catch (err) {
    console.error('Error creating category:', err.stack);
    if (req.files) {
      Object.values(req.files).flat().forEach((file) => {
        fs.unlink(file.path, () => {});
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// Update a solution category
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const { title, description, solutions, existingCategoryImageUrl, existingSectionImageUrl } = req.body;
    // Validate existing image URLs
    if (existingCategoryImageUrl?.startsWith('data:') || existingSectionImageUrl?.startsWith('data:')) {
      return res.status(400).json({ message: 'Base64 images are not supported for existing image URLs' });
    }

    let parsedSolutions = JSON.parse(solutions || '[]');
    let categoryImageUrl = existingCategoryImageUrl || '';
    let sectionImageUrl = existingSectionImageUrl || '';

    // Handle category image
    if (req.files && req.files['categoryImage']) {
      categoryImageUrl = `uploads/${req.files['categoryImage'][0].filename}`;
      if (existingCategoryImageUrl && !existingCategoryImageUrl.startsWith('http')) {
        const oldImagePath = path.join('public', existingCategoryImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old category image:', err);
          });
        }
      }
    }

    // Handle section image
    if (req.files && req.files['sectionImage']) {
      sectionImageUrl = `uploads/${req.files['sectionImage'][0].filename}`;
      if (existingSectionImageUrl && !existingSectionImageUrl.startsWith('http')) {
        const oldImagePath = path.join('public', existingSectionImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old section image:', err);
          });
        }
      }
    }

    // Handle solution images
    const solutionImages = req.files && req.files['solutionImages'] ? req.files['solutionImages'] : [];
    parsedSolutions = parsedSolutions.map((solution, index) => ({
      ...solution,
      imageUrl: solutionImages[index]
        ? `uploads/${solutionImages[index].filename}`
        : req.body[`existingSolutionImageUrl[${index}]`] || solution.imageUrl || '',
    }));

    // Validate solution image URLs
    for (const [index, solution] of parsedSolutions.entries()) {
      if (solution.imageUrl?.startsWith('data:')) {
        return res.status(400).json({ message: `Base64 images are not supported for solution ${index + 1} image URL` });
      }
    }

    const updatedCategory = await SolutionCategory.findByIdAndUpdate(
      id,
      {
        title,
        imageUrl: categoryImageUrl,
        sectionImageUrl,
        description: description || 'Explore our comprehensive solutions designed to meet your specific business needs.',
        solutions: parsedSolutions,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryWithFullUrl = {
      ...updatedCategory.toObject(),
      imageUrl: constructImageUrl(req, updatedCategory.imageUrl),
      sectionImageUrl: constructImageUrl(req, updatedCategory.sectionImageUrl),
      solutions: updatedCategory.solutions.map((solution) => ({
        ...solution.toObject(),
        imageUrl: constructImageUrl(req, solution.imageUrl),
      })),
    };

    res.json(categoryWithFullUrl);
  } catch (err) {
    console.error('Error updating category:', err.stack);
    if (req.files) {
      Object.values(req.files).flat().forEach((file) => {
        fs.unlink(file.path, () => {});
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// Delete a solution category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await SolutionCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete category image
    if (category.imageUrl && !category.imageUrl.startsWith('http') && !category.imageUrl.startsWith('data:')) {
      const imagePath = path.join('public', category.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting category image:', err);
        });
      }
    }

    // Delete section image
    if (category.sectionImageUrl && !category.sectionImageUrl.startsWith('http') && !category.sectionImageUrl.startsWith('data:')) {
      const imagePath = path.join('public', category.sectionImageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting section image:', err);
        });
      }
    }

    // Delete solution images
    category.solutions.forEach((solution) => {
      if (solution.imageUrl && !solution.imageUrl.startsWith('http') && !solution.imageUrl.startsWith('data:')) {
        const imagePath = path.join('public', solution.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting solution image:', err);
          });
        }
      }
    });

    await SolutionCategory.findByIdAndDelete(id);
    res.json({ message: 'Solution category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

export { router as solutionCategoriesRouter };
