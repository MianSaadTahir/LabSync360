const Message = require('../models/Message');
const { successResponse, errorResponse } = require('../utils/response');

const handleTelegramWebhook = async (req, res, next) => {
  try {
    const update = req.body;
    const message = update?.message || update?.edited_message;

    if (!message || !message.message_id) {
      return errorResponse(res, 400, 'Invalid Telegram payload');
    }

    const payload = {
      message_id: String(message.message_id),
      sender_id: String(message.from?.id || 'unknown'),
      text: message.text || '',
      date_received: message.date ? new Date(message.date * 1000) : new Date(),
      raw_payload: update,
    };

    const storedMessage = await Message.findOneAndUpdate(
      { message_id: payload.message_id },
      { ...payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return successResponse(res, { data: storedMessage }, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleTelegramWebhook,
};
