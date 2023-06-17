import ReviewModel from "../models/review.model";
import { Review as ReviewObject } from ".";

/**
 * create - create and save a new review object to the database
 * @param reviewDetails 
 * @returns 
 */
export async function create(reviewDetails: ReviewObject) {
  const { reviewText, reviewerId, userId, rating } = reviewDetails;

  const review = ReviewModel.create({
    text: reviewText,
    reviewer: reviewerId,
    user_id: userId,
    rating
  });

  return review;
}