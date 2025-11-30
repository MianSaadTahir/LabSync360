const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const { successResponse, errorResponse } = require('../utils/response');

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return successResponse(res, { data: messages });
  } catch (error) {
    next(error);
  }
};

const updateMessageTag = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { id } = req.params;
    const { tag } = req.body;

    const message = await Message.findByIdAndUpdate(
      id,
      { tag },
      { new: true }
    );

    if (!message) {
      return errorResponse(res, 404, 'Message not found');
    }

    return successResponse(res, { data: message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  updateMessageTag,
};
