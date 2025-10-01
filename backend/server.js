import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Student from './models/Student.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug: confirm URI is loaded

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({name: 1});
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, regno, address, degree, course, totalmarks } = req.body;
    if (
      !name || !regno || !address ||
      !degree || !course ||
      typeof totalmarks !== 'number'
    ) {
      return res.status(400).json({ error: 'All fields required' });
    }
    if (totalmarks < 0 || totalmarks > 700) {
      return res.status(400).json({ error: 'Total marks must be 0-700' });
    }
    const exists = await Student.findOne({ regno });
    if (exists) {
      return res.status(409).json({ error: 'Student with this registration number already exists' });
    }
    const newStudent = new Student({ name, regno, address, degree, course, totalmarks });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
