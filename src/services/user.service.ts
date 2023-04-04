import { DocumentDefinition } from 'mongoose';
import UserModel, { I_UserDocument } from '../models/user.model';

export async function register(user: DocumentDefinition<I_UserDocument>): Promise<void> {
        try {
                await UserModel.create(user);
        } catch (error) {
                throw error;
        }
}

export async function login(user: DocumentDefinition<I_UserDocument>) {
        try {
                const userFound = await UserModel.findOne({ name: user.name, password: user.password });
        } catch (error) {
                throw error;
        }
}