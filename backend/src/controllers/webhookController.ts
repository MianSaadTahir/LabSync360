import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import { successResponse, errorResponse } from '../utils/response';

interface TelegramUpdate {
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
  };
  text?: string;
  date: number;
}

export const handleTelegramWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const update = req.body as TelegramUpdate;
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

