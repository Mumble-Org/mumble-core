import { Request, Response } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import * as userServices from '../services/user.service';
// import { CustomRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
        try {
                const user = await userServices.login(req.body);
                res.status(200).send(user);
        } catch (error) {
                return res.status(500).send(getErrorMessage(error));
        }
};

export const signup = async (req: Request, res: Response) => {
        try {
                const newUser = req.body;
                await userServices.register(newUser);
        } catch (error) {
                return res.status(500).send(getErrorMessage(error));
        }
};