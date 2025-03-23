import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blogs',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comments = mongoose.model("Comments", CommentsSchema);

export default Comments;