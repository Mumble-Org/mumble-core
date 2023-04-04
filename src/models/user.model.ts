import mongoose from 'mongoose';

export interface I_UserDocument extends mongoose.Document {
        name: string;
        password: string;
}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
        name: { type: String, unique: true },
        password: { type: String },
});

const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);