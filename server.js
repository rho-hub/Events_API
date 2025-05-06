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

// Database connection with production-ready settings
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventDB';
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
      retryWrites: true,
      appName: 'EventAPI'
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503)
    .json({
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      status: 'up'
    });
});

// Routes
app.use('/api/events', eventRoutes);

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server only after DB connection
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});