import express from 'express';
const router = express.Router();

import register, {login, logout} from '../controllers/authController.js';
import registerSchema from '../validators/registerValidator.js';
import validate from '../../../middlewares/validateMiddleware.js';
import loginValidate from '../validators/loginValidator.js';
import authMiddleware from '../../../middlewares/authMiddleware.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginValidate), login);
router.post('/logout', authMiddleware, logout);

export default router;