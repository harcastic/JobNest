import express from 'express';
import validateToken from '../../../middlewares/authMiddleware.js';
import authorizeRoles from '../../../middlewares/roleMiddleware.js';
import validate from '../../../middlewares/validateMiddleware.js';
import jobSchemaValidation from '../validators/jobValidation.js';

import getAllJobs from '../controllers/getJobs.js';
import getJobsById from '../controllers/getJobsById.js';
import createJobs from '../controllers/createJobs.js';

const router = express.Router();


// VIEW JOBS
router.get('/', getAllJobs );
router.get('/:id', getJobsById );

// CREATE JOBS
router.post('/', validateToken, authorizeRoles("recruiter"), validate(jobSchemaValidation), createJobs);


export default router;