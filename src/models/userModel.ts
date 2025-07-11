import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  googleId: { type: String },
  password: { type: String },
});

export default mongoose.model('User', userSchema);
