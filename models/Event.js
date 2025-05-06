const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true,
    index: true // Add index for better performance on date queries
  },
  location: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a method to check if event is expired
eventSchema.methods.isExpired = function() {
  return this.date < new Date();
};

module.exports = mongoose.model('Event', eventSchema);