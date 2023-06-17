import * as reviewServices from "../services/review.services";
import { Request, Response } from 'express';

/**
 * createReview - Create a new review
 * @param req 
 * @param res 
 */
export const createReview = async (req: Request, res: Response) => {
	try {
		const { reviewText, rating, reviewerId, userId } = req.body;

		const review = await reviewServices.create({reviewText, rating, reviewerId, userId })
		res.status(201).json(review);
	} catch (error) {
    res.status(500).send("Internal Server Error");
    console.log(error);
  }
};
