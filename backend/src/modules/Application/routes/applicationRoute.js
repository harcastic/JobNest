
import express from 'express';

const router = express.Router();
import validateToken from '../../../middlewares/authMiddleware.js';
import authorizeRoles from '../../../middlewares/roleMiddleware.js';
import validate from '../../../middlewares/validateMiddleware.js';
import upload from '../../../middlewares/resUploadMiddleware.js';

import appSchema from '../validators/appSchemaValidation.js';
import getApplicationsForJob from '../controllers/getUserApp.js';
import getMyApplication from '../controllers/getMyApp.js';
import getApplicationById from '../controllers/getApplicationById.js';
import uploadApplication from '../controllers/uploadApplication.js';
import deleteMyApplication from '../controllers/deleteMyApp.js';
import deleteJobApplication from '../controllers/deleteAppByJob.js';
import updateApplicationStatus from '../controllers/updateAppStatus.js';
import updateMyApplication from '../controllers/updateMyApplication.js';
import uploadResume from '../../../middlewares/uploadResumeMidddleware.js';


// VIEW APP ROUTE-USER
router.get('/my-applications', validateToken, authorizeRoles("user"), getMyApplication);
router.get('/:id', validateToken, authorizeRoles("user"), getApplicationById);

// VIEW APP ROUTE-RECRUITER
router.get('/job/:jobId', validateToken, authorizeRoles("recruiter"), getApplicationsForJob);
router.patch('/:id/status', validateToken, authorizeRoles("recruiter"), updateApplicationStatus);

//USER APPL CREATION & DELETEION & UPDATE ROUTE
router.post('/:jobId', validateToken, authorizeRoles("user"), uploadResume, uploadApplication);
router.delete('/job/:jobId', validateToken, authorizeRoles("user"), deleteJobApplication);
router.delete('/:id', validateToken, authorizeRoles("user"), deleteMyApplication);
router.put('/:id', validateToken, authorizeRoles("user"), updateMyApplication);

export default router;