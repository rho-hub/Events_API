import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Get all active events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;