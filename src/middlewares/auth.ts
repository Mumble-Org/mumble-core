import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export const SECRET_KEY: Secret = 'testkey' || process.env.MUMBLE_SECRET_KEY;

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

/**
 * authentication middleware to verify tokens and authorize users
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      token = req.cookies['Authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Token missing');
      }
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.body.id = decoded._id;
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send('Unauthorized to perform request.');
  }
};

export default auth;
