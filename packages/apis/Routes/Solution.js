// routes/solutions.js
import express from 'express';
import Solution from '../Models/Solution.js';

const router = express.Router();

// POST route to add a new solution
router.post('/solution', async (req, res) => {
  try {
    const newSolution = new Solution(req.body);
    await newSolution.save();
    res.status(201).json(newSolution);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add solution', error });
  }
});

// GET route to fetch all solutions
router.get('/solution', async (req, res) => {
  try {
    const solutions = await Solution.find();
    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch solutions', error });
  }
});

export {router as solutionsRouter}