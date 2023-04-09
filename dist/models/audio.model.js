"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Audio schema
const audioSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    audioUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });
// create audio model
const AudioModel = mongoose_1.default.model('Audio', audioSchema);
// export model
exports.default = AudioModel;
