const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL or path
  contactInfo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plot', plotSchema); 