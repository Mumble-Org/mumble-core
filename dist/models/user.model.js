"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * User model schema
 */
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    calendar: {
        type: String,
    },
    genres: [
        {
            type: String,
        },
    ],
    location: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    portfolio: [
        {
            type: String,
        },
    ],
    type: {
        type: String,
        enum: ["producer", "artist", "engineer"],
        default: "producer",
    },
    beats: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Beat",
        },
    ],
    beats_uploaded: {
        type: Number,
        default: 0,
        required: true,
    },
    beats_sold: {
        type: Number,
        default: 0,
        required: true,
    },
    songs_mixed: {
        type: Number,
        default: 0,
        required: true,
    },
    rate: {
        type: Number,
        default: 0,
        required: true,
    },
    total_plays: {
        type: Number,
        default: 0,
    },
    saved_beats: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "beat",
        },
    ],
}, { timestamps: true });
// bcrypt salt rounds
const saltRounds = 8;
// mongoose middleware to alter password before saving
UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt_1.default.hash(user.password, saltRounds);
    }
    next();
});
// create user model
const UserModel = mongoose_1.default.model("User", UserSchema);
// export userModels
exports.default = UserModel;
