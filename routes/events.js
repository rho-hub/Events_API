const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all non-expired events
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ date: { $gte: currentDate } })
                              .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to automatically delete expired events
router.use(async (req, res, next) => {
  try {
    const currentDate = new Date();
    await Event.deleteMany({ date: { $lt: currentDate } });
    next();
  } catch (err) {
    console.error('Error deleting expired events:', err);
    next();
  }
});

module.exports = router;