import mongoose from 'mongoose';

const SecurityKeySchema = new mongoose.Schema({
  key: { type: String, required: true }
});

export const SecurityKey = mongoose.model('SecurityKey', SecurityKeySchema);
