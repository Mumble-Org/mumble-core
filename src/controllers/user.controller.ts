import { Request, Response } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import * as userServices from '../services/user.service';
// import { CustomRequest } from '../middleware/auth';


// handles user's signin
export const login = async (req: Request, res: Response) => {
        try {
                const user = await userServices.login(req.body);
                res.cookie('Authorization', user.token);
                res.status(200).send(user);
        } catch (error) {
                return res.status(500).send(getErrorMessage(error));
        }
};

// handles users signup
export const signup = async (req: Request, res: Response) => {
        try {
                const newUser = req.body;
                await userServices.register(newUser);
                res.status(201).send('User created!');
        } catch (error) {
                return res.status(500).send(getErrorMessage(error));
        }
};


// Confirms username input doesn't exist in the database
export const confirmUsername = async (req: Request, res: Response) => {
        try {
                const user = req.body;
                const result = await userServices.checkName(user);
                return res.status(200).send(result);
        } catch (error) {
                return res.status(500).send(getErrorMessage(error));
        }
};