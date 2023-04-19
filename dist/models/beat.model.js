"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Beat schema
 */
const beatSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    beatUrl: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    dataUrl: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    license: {
        type: String,
        enum: ['exclusive', 'basic', 'non-exclusive'],
        default: 'exclusive',
        required: true,
    },
    key: {
        type: String,
        required: true,
    }
}, { timestamps: true });
// create beat model
const BeatModel = mongoose_1.default.model("Beat", beatSchema);
// export model
exports.default = BeatModel;
