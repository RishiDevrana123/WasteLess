import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    addShoppingItems,
    getShoppingList,
    markAsPurchased,
    clearShoppingList
} from '../controllers/shopping.controller.js';

const router = express.Router();

router.use(protect);

router.post('/add', addShoppingItems);
router.get('/', getShoppingList);
router.patch('/:id/purchased', markAsPurchased);
router.delete('/clear', clearShoppingList);

export default router;
