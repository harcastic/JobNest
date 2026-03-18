
import express from 'express';

const router = express.Router();
import validateToken from '../../../middlewares/authMiddleware.js';
import authorizeRoles from '../../../middlewares/roleMiddleware.js';

import getApplicationsForJob from '../controllers/getUserApp.js';
import getMyApplication from '../controllers/getMyApp.js';
import uploadApplication from '../controllers/uploadApplication.js';



router.get('/my-applications', validateToken, authorizeRoles("user"), getMyApplication);
router.get('/job/:jobId', validateToken, authorizeRoles("recruiter"), getApplicationsForJob);
router.post('/:jobId', validateToken, authorizeRoles("user"), uploadApplication);

export default router;