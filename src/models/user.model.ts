import mongoose from 'mongoose';

export interface I_UserDocument extends mongoose.Document {
        name: string;
        password: string;
        calendar: string;
        email: string;
        genres: Array<string>;
        location: string;
        phone_number: string;
        portfolio: Array<string>;
        type: string;
}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
        name: {
                type: String,
                unique: true,
                required: true
        },
        password: {
                type: String,
                required: true,
                min: 5,
        },
        email: {
                type: String,
                unique: true,
                required: true
        },
        calendar: {
                type: String
        },
        genres: [{
                type: String,
        }],
        location: {
                type: String
        },
        phone_number: {
                type: String
        },
        portfolio: [{
                type: String
        }],
        type: {
                type: String,
                enum: ["producer", "artists", "engineer"],
                default: "producer"
        },
},
        { timestamps: true }
);

const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);

export default UserModel;