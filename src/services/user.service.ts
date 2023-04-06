import { HydratedDocument } from 'mongoose';
import UserModel, { I_UserDocument } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../middlewares/auth';


export async function register(user: HydratedDocument<I_UserDocument>): Promise<void> {
        try {
                const newUser = new UserModel(user);
                await newUser.save();
        } catch (error) {
                throw error;
        }
}

export async function login(user: HydratedDocument<I_UserDocument>) {
        try {
                const userFound = await UserModel.findOne({ name: user.name });

                if (!userFound) {
                        throw new Error("User doesn't exist");
                }

                const isMatch = bcrypt.compareSync(user.password, userFound.password);

                if (isMatch) {
                        const token = jwt.sign({_id: userFound._id?.toString(),
                                                name: userFound.name}, 
                                                SECRET_KEY,
                                                {
                                                        expiresIn: '2 days',
                                                });
                        userFound.password = "";
                        return { user: userFound, token: token};
                } else {
                        throw new Error('Password is not correct');
                }
        } catch (error) {
                throw error;
        }
}

export async function checkName(user: HydratedDocument<I_UserDocument>) {
        try {
                const userFound = await UserModel.findOne({ name: user.name});
                if (userFound) {
                        return {'value': 'true', 'message': 'User already exist!'};
                } else {
                        return {'value': 'false', 'message': 'Username is available!'};
                }
        } catch (error) {
                throw error;
        }
}