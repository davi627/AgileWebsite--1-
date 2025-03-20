// models/Logo.js
import mongoose from 'mongoose';

const LogoSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  bwLogoUrl: { type: String, required: true }, 
  colorLogoUrl: { type: String, required: true }, 
});

export default mongoose.model('Logo', LogoSchema);