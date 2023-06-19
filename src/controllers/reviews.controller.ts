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

		const review = await reviewServices.create({reviewText, rating, reviewerId, userId });
		res.status(201).json(review);
	} catch (error) {
		if (error instanceof Error && error.message == "You cannot review yourself!") {
			return res.status(401).send(error.message);
		}
    res.status(500).send("Internal Server Error");
    console.log(error);
  }
};

/**
 * getReview - get review
 * @param req
 * @param res
 * @returns 
 */
export const getReview = async (req: Request, res: Response) => {
	try {
		// Retrieve review id
		const { id } = req.body;
		const review = await reviewServices.get(id);

		return res.status(200).json(review);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		}
		console.log(error);
	}
}
