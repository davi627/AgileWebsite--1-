import express from 'express';
import Blogs from '../Models/Blogs.js';

const router = express.Router();

// Get all posts
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({ date: -1 });
    res.json(blogs); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Post not found' });
    res.json(blog); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new post
router.post('/blogs', async (req, res) => {
  const { title, description, imageUrl, href, author } = req.body;

  try {
    const newBlog = new Blogs({
      title,
      description,
      imageUrl,
      href: href || '#', 
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

export { router as BlogsRouter };