import express from 'express';
const router = express.Router();

import validateToken from '../../../middlewares/authMiddleware.js';
import getProfile from '../controllers/userProfile.js';
import updateProfile from '../controllers/updateProfile.js';

// GET PROFILE
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);

export default router;