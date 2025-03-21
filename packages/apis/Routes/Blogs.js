import express from 'express';
import Blogs from '../Models/Blogs.js';
import Comments from '../Models/Comments.js';

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
  const { title, description, imageUrl, author } = req.body;

  try {
    const newBlog = new Blogs({
      title,
      description, 
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

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comments.find({ blogId: req.params.id }).sort({ date: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a blog
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

export { router as BlogsRouter };

