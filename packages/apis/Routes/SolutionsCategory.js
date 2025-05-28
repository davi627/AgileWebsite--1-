import express from 'express'
import SolutionCategory from '../Models/Solutions.js'
const router = express.Router()

// Get all solution categories
router.get('/', async (req, res) => {
  try {
    const categories = await SolutionCategory.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a new solution category
router.post('/', async (req, res) => {
  const category = new SolutionCategory({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    solutions: req.body.solutions
  })

  try {
    const newCategory = await category.save()
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update a solution category
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await SolutionCategory.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        solutions: req.body.solutions
      },
      { new: true }
    )
    res.json(updatedCategory)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a solution category
router.delete('/:id', async (req, res) => {
  try {
    await SolutionCategory.findByIdAndDelete(req.params.id)
    res.json({ message: 'Solution category deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export { router as solutionCategoriesRouter }
