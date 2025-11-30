const express = require('express');
const { extractFromMessage } = require('../controllers/extractionController');

const router = express.Router();

router.post('/:message_id', extractFromMessage);

module.exports = router;
