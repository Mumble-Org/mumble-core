"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * create - create and save a new review object to the database
 * @param reviewDetails
 * @returns
 */
async function create(reviewDetails) {
    const { reviewText, reviewerId, userId, rating } = reviewDetails;
    if (reviewerId != userId) {
        const review = await review_model_1.default.create({
            text: reviewText,
            reviewer: reviewerId,
            user_id: userId,
            rating
        });
        // update producer model
        await user_model_1.default.find({ _id: userId }).updateOne({
            $push: { reviews: review._id },
        });
        return review;
    }
    throw new Error("You cannot review yourself!");
}
exports.create = create;
