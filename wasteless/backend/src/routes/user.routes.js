import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getProfile,
    updateProfile,
    uploadAvatar,
    changePassword,
    recordCookedRecipe
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protect);

router.route('/profile').get(getProfile).put(updateProfile);

router.post('/avatar', uploadAvatar);
router.put('/password', changePassword);
router.post('/cooked-recipes', recordCookedRecipe);

export default router;
