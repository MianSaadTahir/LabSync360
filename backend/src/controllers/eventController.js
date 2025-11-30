const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const ExtractedEvent = require('../models/ExtractedEvent');
const Message = require('../models/Message');
const { successResponse, errorResponse } = require('../utils/response');

const buildFilters = (query) => {
  const filters = {};
  if (query.date) {
    filters.date = query.date;
  }
  if (query.type) {
    filters.type = query.type;
  }
  return filters;
};

const createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { extractedEventId } = req.body;

    const extracted = await ExtractedEvent.findById(extractedEventId);
    if (!extracted) {
      return errorResponse(res, 404, 'Extracted event not found');
    }

    const sourceMessage = await Message.findOne({ message_id: extracted.message_id });

    const event = await Event.create({
      title: extracted.title,
      date: extracted.date,
      time: extracted.time,
      source_message_id: extracted.message_id,
      source_text: extracted.source_text,
      confidence: extracted.confidence,
      type: sourceMessage?.tag || 'none',
    });

    return successResponse(res, { data: event }, 201);
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const filters = buildFilters(req.query);
    const events = await Event.find(filters).sort({ createdAt: -1 });
    return successResponse(res, { data: events });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    return successResponse(res, { data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    return successResponse(res, { data: event });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    return successResponse(res, { message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
