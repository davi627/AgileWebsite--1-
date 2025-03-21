
import mongoose from 'mongoose';

const BlogsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },
  author: {
    name: {
      type: String,
      required: true
    }
  }
});

// Format the date for display
BlogsSchema.virtual('formattedDate').get(function() {
  return new Date(this.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
});

// Add ISO format date for datetime attribute
BlogsSchema.virtual('datetime').get(function() {
  return new Date(this.date).toISOString().split('T')[0];
}); 

// Enable virtuals
BlogsSchema.set('toJSON', { virtuals: true });
BlogsSchema.set('toObject', { virtuals: true });

const Blogs = mongoose.model('Blogs', BlogsSchema);

export default Blogs;