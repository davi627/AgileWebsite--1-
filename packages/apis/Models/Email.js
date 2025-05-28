import mongoose from 'mongoose'

const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  html: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
})

const Email = mongoose.model('Email', emailSchema)
export default Email
