import express from 'express';
import validateToken from '../../../middlewares/authMiddleware.js';
import authorizeRoles from '../../../middlewares/roleMiddleware.js';
import validate from '../../../middlewares/validateMiddleware.js';
import jobSchemaValidation from '../validators/jobValidation.js';

import getAllJobs from '../controllers/getAllJobs.js';
import getJobsById from '../controllers/getJobsById.js';
import createJobs from '../controllers/createJobs.js';
import updateJob from '../controllers/updateJobs.js';
import deleteJob from '../controllers/deleteJobs.js';
import recruiterCreatedJobs from '../controllers/getRecruitersJobs.js'; 

const router = express.Router();

// GET ALL JOBS
router.get('/', getAllJobs);

// RECRUITER DASHBOARD
router.get('/recruiter/jobs', validateToken, authorizeRoles("recruiter"), recruiterCreatedJobs);

// JOB DETAILS
router.get('/:id', getJobsById);

// RECRUITER JOB MANAGEMENT
router.post('/', validateToken, authorizeRoles("recruiter"), validate(jobSchemaValidation), createJobs);
router.put('/:id', validateToken, authorizeRoles("recruiter"), updateJob);
router.delete('/:id', validateToken, authorizeRoles("recruiter"), deleteJob);

export default router;