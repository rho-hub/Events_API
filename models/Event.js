import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  createdAt: { type: Date, default: Date.now }
});

// Add a method to check if event is expired
eventSchema.methods.isExpired = function() {
  return this.date < new Date();
};

export default mongoose.model('Event', eventSchema);