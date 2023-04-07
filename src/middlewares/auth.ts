import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'testkey' || process.env.MUMBLE_SECRET_KEY;

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

/**
 * authentication middleware to verify tokens and authorize users
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Token missing');
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send('Authorized to perform request.');
  }
};
