
import mongoose from 'mongoose'

const statisticSchema = new mongoose.Schema({
  successfulProjects: {
    type: String,
    required: true,
    default: 0
  },
  happyCustomers: {
    type: String,
    required: true,
    default: 0
  },
  customerSatisfaction: {
    type: String,
    required: true,
    default: '0%'
  },
  experience: {
    type: String,
    required: true,
    default: '0 Years'
  }
})

const Statistic = mongoose.model('Statistic', statisticSchema)

export default Statistic