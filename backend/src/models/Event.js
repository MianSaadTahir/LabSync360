const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EventSchema = new mongoose.Schema(
  {
    event_id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: { type: String, required: true },
    date: { type: String },
    time: { type: String },
    type: {
      type: String,
      enum: ['meeting', 'reminder', 'task', 'none'],
      default: 'none',
    },
    source_message_id: { type: String },
    source_text: { type: String },
    confidence: {
      type: String,
      enum: ['low', 'medium'],
      default: 'low',
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
