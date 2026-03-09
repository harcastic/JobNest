import express from 'express';
const router = express.Router();

import register, {login} from '../controllers/authController.js';
import registerSchema from '../validators/registerValidator.js';
import validate from '../../../middlewares/validateMiddleware.js';
import loginValidate from '../validators/loginValidator.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginValidate), login);

export default router;