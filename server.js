import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import eventRoutes from './routes/events.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection (updated without deprecated options)
try {
  await mongoose.connect('mongodb://localhost:27017/eventDB');
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('MongoDB connection error:', err);
}

// Routes
app.use('/api/events', eventRoutes);

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});