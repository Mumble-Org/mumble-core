"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.updateRating = exports.create = void 0;
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
            rating,
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
/**
 * Update producer's rating
 * @param {String} id
 */
async function updateRating(id) {
    const producer = await user_model_1.default.findById(id);
    const reviews = await review_model_1.default.find({ user_id: id });
    let sum = 0;
    reviews.forEach((review) => (sum += review.rating));
    producer.rating = sum / reviews.length;
    await producer.save();
}
exports.updateRating = updateRating;
/**
 * get - get review from database
 * @param id
 * @returns
 */
async function get(id) {
    try {
        const review = await review_model_1.default.findById(id);
        if (!review)
            throw new Error("Review with the given ID does't exists.");
        return review;
    }
    catch (error) {
        throw new Error("Review with the given ID doesn't exists.");
    }
}
exports.get = get;
