import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiry: Date
})

const UserModel = mongoose.model('User', userSchema)
export { UserModel as User }
