import mongoose from 'mongoose'
const CommentSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    products: {
      type: [String],
      required: false
    },
    image: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
)
export default mongoose.model('Comment', CommentSchema)
