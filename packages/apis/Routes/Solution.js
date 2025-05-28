// routes/solutions.js
import express from 'express'
import Solution from '../Models/Solution.js'

const router = express.Router()

// POST route to add a new solution
router.post('/solution', async (req, res) => {
  try {
    const newSolution = new Solution(req.body)
    await newSolution.save()
    res.status(201).json(newSolution)
  } catch (error) {
    res.status(500).json({ message: 'Failed to add solution', error })
  }
})

// GET route to fetch all solutions
router.get('/solution', async (req, res) => {
  try {
    const solutions = await Solution.find()
    res.status(200).json(solutions)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch solutions', error })
  }
})

// DELETE route to delete a solution by ID
router.delete('/solution/:id', async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id)
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' })
    }
    res.status(200).json({ message: 'Solution deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete solution', error })
  }
})

export { router as solutionsRouter }
