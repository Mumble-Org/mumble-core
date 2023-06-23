import ReviewModel from "../models/review.model";
import { Review as ReviewObject } from ".";
import UserModel from "../models/user.model";

/**
 * create - create and save a new review object to the database
 * @param reviewDetails
 * @returns
 */
export async function create(reviewDetails: ReviewObject) {
	const { reviewText, reviewerId, userId, rating } = reviewDetails;

	if (reviewerId != userId) {
		const review = await ReviewModel.create({
			text: reviewText,
			reviewer: reviewerId,
			user_id: userId,
			rating,
		});

		// update producer model
		await UserModel.find({ _id: userId }).updateOne({
			$push: { reviews: review._id },
		});

		return review;
	}

	throw new Error("You cannot review yourself!");
}

/**
 * Update producer's rating
 * @param {String} id
 */
export async function updateRating(id: string) {
	const producer = await UserModel.findById(id);
	const reviews = await ReviewModel.find({ user_id: id });
	let sum = 0;

  reviews.forEach((review) => (sum += review.rating));
  producer.rating = sum / reviews.length;
  await producer.save();
}

/**
 * get - get review from database
 * @param id
 * @returns
 */
export async function get(id: string) {
	try {
		const review = await ReviewModel.findById(id);

		if (!review) throw new Error("Review with the given ID does't exists.");

		return review;
	} catch (error) {
		throw new Error("Review with the given ID doesn't exists.");
	}
}
