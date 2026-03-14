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


// VIEW JOBS
router.get('/', getAllJobs );    

// SEARCH / JOB BY ID
router.get('/:id', getJobsById );


// CREATE JOBS
router.post('/', validateToken, authorizeRoles("recruiter"), validate(jobSchemaValidation), createJobs);
router.put('/:id', validateToken, authorizeRoles("recruiter"), updateJob);
router.delete('/:id', validateToken, authorizeRoles("recruiter"), deleteJob);
router.get('/recruiter/jobs', validateToken, authorizeRoles("recruiter"), recruiterCreatedJobs);

export default router;