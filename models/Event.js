import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },      // Combined date/time
    location: String,
    price: { type: Number, default: 0 },      // New
    link: String,                             // New (optional URL)
    imageUrl: String,                         // New (link to image)
    createdAt: { type: Date, default: Date.now }
  });

// Add a method to check if event is expired
eventSchema.methods.isExpired = function() {
  return this.date < new Date();
};

export default mongoose.model('Event', eventSchema);