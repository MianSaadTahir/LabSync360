const mongoose = require("mongoose");
const Message = require("../models/Message");
const ExtractedEvent = require("../models/ExtractedEvent");
const Event = require("../models/Event");
const { extractEvent } = require("../utils/extractor");
const { successResponse, errorResponse } = require("../utils/response");

const extractFromMessage = async (req, res, next) => {
  try {
    const { message_id } = req.params;
    let message = null;

    if (mongoose.Types.ObjectId.isValid(message_id)) {
      message = await Message.findById(message_id).lean();
    }

    if (!message) {
      message = await Message.findOne({ message_id }).lean();
    }

    if (!message) {
      return errorResponse(res, 404, "Message not found");
    }

    const extraction = extractEvent(message.text);

    const extractedEvent = await ExtractedEvent.create({
      message_id: message.message_id,
      title: extraction.title,
      date: extraction.date,
      time: extraction.time,
      confidence: extraction.confidence,
      source_text: message.text,
    });

    return successResponse(res, { data: extractedEvent }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Automated workflow: Extract + Create Event in one call
 * Optionally accepts a tag in the request body
 */
const processMessageToEvent = async (req, res, next) => {
  try {
    const { message_id } = req.params;
    const { tag } = req.body; // Optional: can tag and process in one step

    let message = null;

    // Find message by _id or message_id
    if (mongoose.Types.ObjectId.isValid(message_id)) {
      message = await Message.findById(message_id);
    }

    if (!message) {
      message = await Message.findOne({ message_id });
    }

    if (!message) {
      return errorResponse(res, 404, "Message not found");
    }

    // Update tag if provided
    if (tag && ["meeting", "reminder", "task", "none"].includes(tag)) {
      message.tag = tag;
      await message.save();
    }

    // Extract event data
    const extraction = extractEvent(message.text);

    // Create ExtractedEvent
    const extractedEvent = await ExtractedEvent.create({
      message_id: message.message_id,
      title: extraction.title,
      date: extraction.date,
      time: extraction.time,
      confidence: extraction.confidence,
      source_text: message.text,
    });

    // Create final Event
    const event = await Event.create({
      title: extractedEvent.title,
      date: extractedEvent.date,
      time: extractedEvent.time,
      source_message_id: message.message_id,
      source_text: message.text,
      confidence: extractedEvent.confidence,
      type: message.tag || "none",
    });

    return successResponse(
      res,
      {
        data: {
          message,
          extractedEvent,
          event,
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  extractFromMessage,
  processMessageToEvent,
};
