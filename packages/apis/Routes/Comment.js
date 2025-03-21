import express from 'express';
import Comment from '../Models/Comment.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure Multer for file uploads (comments)
const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comments/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadCommentLogo = multer({ storage: commentStorage });

// Get all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 }); 
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new comment
router.post('/comments', uploadCommentLogo.single('logo'), async (req, res) => {
  const { description, author, products } = req.body;
  const logo = req.file ? `/uploads/comments/${req.file.filename}` : null;

  try {
    const newComment = new Comment({
      logo,
      description,
      author,
      products,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve a comment
router.put('/comments/:id/approve', async (req, res) => {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        { status: 'approved' },
        { new: true }
      );
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Reject a comment
  router.put('/comments/:id/reject', async (req, res) => {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { new: true }
      );
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export { router as CommentRouter };