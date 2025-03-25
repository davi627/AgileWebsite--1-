import mongoose from 'mongoose'
import Blogs from './Blogs.js';
const CommentsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    minlength: [3, 'Comment must be at least 3 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    minlength: [2, 'Author name must be at least 2 characters']
  },
  blogId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blogs', 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: () => new Date() 
  }
});

// Add virtual for formatted date
CommentsSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

const Comments = mongoose.model('Comments', CommentsSchema);

export default Comments;