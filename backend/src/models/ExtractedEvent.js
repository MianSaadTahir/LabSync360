const mongoose = require('mongoose');

const ExtractedEventSchema = new mongoose.Schema(
  {
    message_id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String },
    time: { type: String },
    confidence: {
      type: String,
      enum: ['low', 'medium'],
      default: 'low',
    },
    source_text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExtractedEvent', ExtractedEventSchema);
