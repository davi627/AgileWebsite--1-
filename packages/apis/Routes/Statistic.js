// routes/statistics.js
import express from 'express'
import Statistic from '../Models/Statistic.js'

const router = express.Router()

// POST/UPDATE Statistics
router.post('/statistics', async (req, res) => {
  try {
    const { successfulProjects, happyCustomers, customerSatisfaction, experience } = req.body

    // Check if statistics already exist
    let statistic = await Statistic.findOne()

    if (!statistic) {
      // Create new statistics if they don't exist
      statistic = new Statistic({
        successfulProjects,
        happyCustomers,
        customerSatisfaction,
        experience
      })
    } else {
      // Update existing statistics
      statistic.successfulProjects = successfulProjects
      statistic.happyCustomers = happyCustomers
      statistic.customerSatisfaction = customerSatisfaction
      statistic.experience = experience
    }

    // Save the statistics
    await statistic.save()

    res.status(200).json({ message: 'Statistics updated successfully!', statistic })
  } catch (error) {
    console.error('Failed to update statistics:', error)
    res.status(500).json({ message: 'Failed to update statistics' })
  }
})

// GET Statistics
router.get('/statistics', async (req, res) => {
  try {
    const statistic = await Statistic.findOne()
    if (!statistic) {
      return res.status(404).json({ message: 'No statistics found' })
    }
    res.status(200).json(statistic)
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
    res.status(500).json({ message: 'Failed to fetch statistics' })
  }
})

export { router as statisticsRouter}