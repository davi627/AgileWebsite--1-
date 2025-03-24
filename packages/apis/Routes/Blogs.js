import express from "express";
import multer from "multer";
import path from "path";
import Blogs from "../Models/Blogs.js";
import Comments from "../Models/Comments.js";

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
      imageUrl, // Include the imageUrl field
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

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comments.find({ blogId: req.params.id });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  const { text, author } = req.body;
  try {
    const newComment = new Comments({
      text,
      author,
      blogId: req.params.id,
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  const { text, author } = req.body;
  try {
    const newComment = new Comments({
      text,
      author,
      blogId: req.params.id,
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  // Regular expression to check if ID is a valid MongoDB ObjectId (24 hex characters)
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