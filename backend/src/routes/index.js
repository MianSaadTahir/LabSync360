const express = require('express');
const messageRoutes = require('./messageRoutes');
const webhookRoutes = require('./webhookRoutes');
const eventRoutes = require('./eventRoutes');
const extractionRoutes = require('./extractionRoutes');

const router = express.Router();

router.use('/messages', messageRoutes);
router.use('/webhook', webhookRoutes);
router.use('/events', eventRoutes);
router.use('/extract', extractionRoutes);

module.exports = router;
