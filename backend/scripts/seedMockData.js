#!/usr/bin/env node
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Message = require('../src/models/Message');
const ExtractedEvent = require('../src/models/ExtractedEvent');
const Event = require('../src/models/Event');

const run = async () => {
  try {
    await connectDB();

    await Promise.all([Message.deleteMany({}), ExtractedEvent.deleteMany({}), Event.deleteMany({})]);

    const messages = await Message.insertMany([
      {
        message_id: '1001',
        sender_id: '501',
        text: 'Team meeting tomorrow at 3pm',
        tag: 'meeting',
        date_received: new Date(),
        raw_payload: { mock: true },
      },
      {
        message_id: '1002',
        sender_id: '502',
        text: 'Reminder: submit report today 11am',
        tag: 'reminder',
        date_received: new Date(),
        raw_payload: { mock: true },
      },
    ]);

    const extracted = await ExtractedEvent.insertMany(
      messages.map((msg) => ({
        message_id: msg.message_id,
        title: msg.tag === 'meeting' ? 'Upcoming meeting' : 'Reminder task',
        date: new Date().toISOString().split('T')[0],
        time: msg.tag === 'meeting' ? '15:00' : '11:00',
        confidence: 'medium',
        source_text: msg.text,
      }))
    );

    await Event.insertMany(
      extracted.map((evt, idx) => ({
        title: evt.title,
        date: evt.date,
        time: evt.time,
        source_message_id: evt.message_id,
        source_text: evt.source_text,
        confidence: 'medium',
        type: messages[idx].tag,
      }))
    );

    console.log('Mock data inserted');
  } catch (error) {
    console.error('Failed to seed mock data:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
