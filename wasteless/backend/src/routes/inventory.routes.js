import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getInventory,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getExpiringItems,
    processSmartEntry,
} from '../controllers/inventory.controller.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getInventory).post(createInventoryItem);

router.route('/smart-entry').post(processSmartEntry);

router.route('/expiring').get(getExpiringItems);

router
    .route('/:id')
    .get(getInventoryItem)
    .put(updateInventoryItem)
    .delete(deleteInventoryItem);

export default router;
