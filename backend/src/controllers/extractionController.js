const mongoose = require("mongoose");
const Message = require("../models/Message");
const ExtractedEvent = require("../models/ExtractedEvent");
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

module.exports = {
  extractFromMessage,
};
