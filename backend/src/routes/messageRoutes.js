const express = require('express');
const { body } = require('express-validator');
const { getMessages, updateMessageTag } = require('../controllers/messageController');

const router = express.Router();

router.get('/', getMessages);
router.patch(
  '/:id/tag',
  [body('tag').isIn(['meeting', 'reminder', 'task', 'none']).withMessage('Invalid tag')],
  updateMessageTag
);

module.exports = router;
