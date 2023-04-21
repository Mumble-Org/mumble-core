import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import auth from '../middlewares/auth';

const router: Router = Router();

// user routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/confirmUser', userController.confirmUsername);
router.post('/confirmEmail', userController.confirmEmail);
router.get('/trendingProducers', userController.getTrendingProducers);
router.get('/engineers', userController.getSoundEngineers);
router.put('/save', auth, userController.SavedBeats);

export default router;
