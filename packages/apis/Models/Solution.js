// models/Solution.js
import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  soln: { type: String, required: true },
  img: { type: String, required: true },
  route: { type: String, required: true },
  faqs: [
    {
      q: { type: String, required: true },
      a: { type: String, required: true },
    },
  ],
});

export default mongoose.model('Solution', SolutionSchema);