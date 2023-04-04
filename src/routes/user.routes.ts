import { Router } from 'express';
import * as userController from '../controllers/user.controller';

// user routes
Router.post('/login', userController.login);
Router.post('/signup', userController.signup);