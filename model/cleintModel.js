const mongoose = require('mongoose');
const slugify = require('slugify');

const cleintSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide a name to recognise'],
  },
  location: [
    {
      coords: {
        resultTime: Date,
        lat: Number,
        long: Number,
      },
    },
  ],
});

const cleints = mongoose.model('Cleints', cleintSchema);

module.exports = cleints;
