import express from "express";
import multer from "multer";
import path from "path";
import Blogs from "../Models/Blogs.js";
import Comments from "../Models/Comments.js";
import mongoose from 'mongoose'

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Endpoint to handle image uploads
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Construct the URL of the uploaded image
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/blogs/${req.file.filename}`;

  // Return the image URL
  res.json({ imageUrl });
});

// Create new blog post
router.post("/blogs", async (req, res) => {
  const { title, content, author, imageUrl } = req.body;

  // Validate content structure
  if (!Array.isArray(content)) {
    return res.status(400).json({ message: "Content must be an array" });
  }

  for (const item of content) {
    if (!item.type || !item.data) {
      return res.status(400).json({ message: "Each content item must have a type and data" });
    }
  }

  try {
    const newBlog = new Blogs({
      title,
      content,
      imageUrl,
      author: {
        name: author.name,
      },
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all blog posts
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/blogs/top', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 8); // Max limit of 8
    const blogs = await Blogs.find().sort({ views: -1 }).limit(limit);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog post by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment views for a blog
router.patch('/blogs/:id/view', async (req, res) => {
  try {
    const blog = await Blogs.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for a blog
// In your blog routes (routes/Blogs.js)

// Get approved comments for a blog
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comments.find({ 
      blogId: req.params.id,
      status: 'approved'
    }).sort({ date: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment (goes to pending)
// POST /:id/comments - Add a new comment (pending moderation)
router.post('/:id/comments', async (req, res) => {
  const { text, author } = req.body;
  const { id } = req.params;

  // Validate the blog ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  try {
    const newComment = new Comments({
      text,
      author,
      blogId: id,
      status: 'pending',
      date: req.body.date || new Date() 
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Admin routes for moderation
router.get('/comments/pending', async (req, res) => {
  try {
    const comments = await Comments.find({ status: 'pending' })
      .populate('blogId', 'title')
      .sort({ date: -1 })
      .lean(); // Convert to plain JavaScript objects
    
    const formattedComments = comments.map(comment => {
      // Safely handle date formatting
      let formattedDate;
      try {
        formattedDate = comment.date 
          ? new Date(comment.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'No date';
      } catch (e) {
        formattedDate = 'Invalid date';
      }
      
      return {
        ...comment,
        formattedDate
      };
    });
    
    res.json(formattedComments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch comments',
      error: error.message 
    });
  }
});

router.patch('/comments/:id/approve', async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/comments/:id/reject', async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Delete a blog post
router.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  // Regular expression to check if ID is a valid MongoDB ObjectId
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (!isValidObjectId) {
    return res.status(400).json({ message: "Invalid blog ID format" });
  }

  try {
    const blog = await Blogs.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Blog', error });
  }
});

export { router as BlogsRouter };