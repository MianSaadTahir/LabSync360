import express from 'express';
import messageRoutes from './messageRoutes';
import webhookRoutes from './webhookRoutes';
import agentRoutes from './agentRoutes';
import mcpRoutes from './mcpRoutes';

const router = express.Router();

router.use('/messages', messageRoutes);
router.use('/webhook', webhookRoutes);
router.use('/agent', agentRoutes);
router.use('/mcp', mcpRoutes);

export default router;

