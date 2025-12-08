import express from 'express';
import { getBudgets, getBudgetById } from '../controllers/budgetController';

const router = express.Router();

router.get('/', getBudgets);
router.get('/:id', getBudgetById);

export default router;

