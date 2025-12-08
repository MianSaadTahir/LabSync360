import express from 'express';
import { extractFromMessage } from '../controllers/agentController';

const router = express.Router();

router.post('/extract/:messageId', extractFromMessage);

export default router;

