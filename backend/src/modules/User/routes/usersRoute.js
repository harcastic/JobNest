import express from 'express';
const router = express.Router();

import validateToken from '../../../middlewares/authMiddleware.js';
import authorizeRoles from '../../../middlewares/roleMiddleware.js';
import getProfile from '../controllers/userProfile.js';
import updateProfile from '../controllers/updateProfile.js';
import deleteProfile from '../controllers/deleteProfile.js';
import getAllUsers from '../controllers/getAllUsers.js';
import getUser from '../controllers/getUser.js';
import deleteUserAccount from '../controllers/deleteUser.js';

// PROFILE ROUTES
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);
router.delete('/profile', validateToken, deleteProfile);

//RECRUITER + ADMIN ROUTES 
router.get('/:id', validateToken, authorizeRoles("recruiter"), getUser);  // SEARCH USER BY ID

// ADMIN ACCESS ROUTES
router.get("/", validateToken, authorizeRoles("admin"), getAllUsers);
router.delete('/:id', validateToken, authorizeRoles("admin"), deleteUserAccount);




export default router;