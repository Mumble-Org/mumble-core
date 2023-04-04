import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router: Router = Router();

// user routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);

export default router;