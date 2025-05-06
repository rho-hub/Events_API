const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/events');

const cron = require('node-cron');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/eventDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

cron.schedule('0 0 * * *', async () => {
    try {
      const currentDate = new Date();
      const result = await Event.deleteMany({ date: { $lt: currentDate } });
      console.log(`Cleaned up ${result.deletedCount} expired events`);
    } catch (err) {
      console.error('Error in scheduled cleanup:', err);
    }
  });