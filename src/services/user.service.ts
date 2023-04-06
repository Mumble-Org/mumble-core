import { HydratedDocument } from 'mongoose';
import UserModel, { I_UserDocument } from '../models/user.model';

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
                const userFound = await UserModel.findOne({ name: user.name, password: user.password });
        } catch (error) {
                throw error;
        }
}

export async function checkName(user: HydratedDocument<I_UserDocument>) {
        try {
                const userFound = await UserModel.findOne({ name: user.name});
        } catch (error) {
                throw error;
        }
}