import express from 'express';
const router = express.Router();

import validateToken from '../../../middlewares/authMiddleware.js';
import getProfile from '../controllers/userProfile.js';
import updateProfile from '../controllers/updateProfile.js';
import deleteProfile from '../controllers/deleteProfile.js';

// GET PROFILE
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);
router.delete('/profile', validateToken, deleteProfile);

// 

export default router;