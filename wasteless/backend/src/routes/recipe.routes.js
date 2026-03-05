import express from 'express';
import { protect } from '../middleware/auth.js';
import { getSuggestions, getCustomSuggestions } from '../controllers/recipe.controller.js';

const router = express.Router();

router.use(protect);

router.get('/suggestions', getSuggestions);
router.post('/custom', getCustomSuggestions);

export default router;
