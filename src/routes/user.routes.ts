import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import auth from '../middlewares/auth';
import upload from '../middlewares/upload.middleware';

const router: Router = Router();

// user routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/confirmUser', userController.confirmUsername);
router.post('/confirmEmail', userController.confirmEmail);
router.get('/trendingProducers', userController.getTrendingProducers);
router.get('/engineers', userController.getSoundEngineers);
router.get('/profile', auth, userController.getProfileImage);
router.put('/save', auth, userController.SavedBeats);
router.put('/profileImage', [upload.single('image'), auth], userController.uploadProfileImage);

export default router;
