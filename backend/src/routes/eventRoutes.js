const express = require('express');
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.post(
  '/create',
  [body('extractedEventId').notEmpty().withMessage('extractedEventId is required')],
  createEvent
);

module.exports = router;
