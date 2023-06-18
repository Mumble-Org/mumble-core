"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define review Schema
const ReviewSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
    reviewer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
// Create review model
const ReviewModel = mongoose_1.default.model('Review', ReviewSchema);
// Export model
exports.default = ReviewModel;
