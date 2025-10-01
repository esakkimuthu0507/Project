import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regno: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  degree: { type: String, required: true },
  course: { type: String, required: true },
  totalmarks: { type: Number, required: true, min: 0, max: 700 }
});

export default mongoose.model('Student', studentSchema);
