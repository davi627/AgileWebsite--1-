import mongoose from 'mongoose'

const featureSchema = new mongoose.Schema({
  text: String
})

const solutionSchema = new mongoose.Schema({
  id: Number,
  name: String,
  shortDesc: String,
  fullDesc: String,
  features: [featureSchema],
  implementation: String
})

const solutionCategorySchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  description: String, 
  solutions: [solutionSchema]
})

export default mongoose.model('SolutionCategory', solutionCategorySchema)