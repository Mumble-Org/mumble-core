import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

// model schema definition
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
                enum: ["producer", "artist", "engineer"],
                default: "producer"
        },
},
        { timestamps: true }
);

// bcrypt salt rounds
const saltRounds = 8;

// mongoose middleware to alter password before saving
UserSchema.pre('save', async function (next) {
        const user = this;
        if (user.isModified('password')) {
                user.password = await bcrypt.hash(user.password, saltRounds);
        }
        next();
});


// create model/home/johnrumide/dev/mumble-core/src/services
const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);

// export userModels
export default UserModel;