// import upload from "../utils/s3bucket.utils";
import * as userServices from "../services/user.service";

import { Request, Response } from "express";
import { getSignedUrl, uploadImage } from "../utils/s3bucket.util";

import UserModel from "../models/user.model";
import { getErrorMessage } from "../utils/errors.util";

/**
 * Logs in a user
 */
export const login = async (req: Request, res: Response) => {
	try {
		const user = await userServices.login(req.body);
		res.cookie("Authorization", `Bearer ${user.token}`);
		res.set("Authorization", `Bearer ${user.token}`);
		res.status(200).json(user);
	} catch (error) {
		return res.status(500).send(getErrorMessage(error));
	}
};

/**
 * Signs up a user
 */
export const signup = async (req: Request, res: Response) => {
	try {
		const body = await userServices.parseUser(req.body);
		const user = await userServices.register(body);
		res.cookie("Authorization", `Bearer ${user?.token}`);
		res.set("Authorization", `Bearer ${user?.token}`);
		res.status(201).json(user);
	} catch (error) {
		return res.status(500).send(getErrorMessage(error));
	}
};

/**
 * Updates a user
 */
export const update = async (req: Request, res: Response) => {
	try {
		const body = await userServices.parseUser(req.body);
		const user = await userServices.updateUser(body);
		res.status(200).json(user);
	} catch (error) {
		return res.status(500).send(getErrorMessage(error));
	}
};

/**
 * Confirms username input doesn't exist in the database
 */
export const confirmUsername = async (req: Request, res: Response) => {
	try {
		const user = req.body;
		const result = await userServices.checkName(user);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).send(getErrorMessage(error));
	}
};

/**
 * Confirms email input doesn't exist in the database
 */
export const confirmEmail = async (req: Request, res: Response) => {
	try {
		const user = req.body;
		const result = await userServices.checkEmail(user);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).send(getErrorMessage(error));
	}
};

/**
 * Responds with trending prodcers
 * @param req
 * @param res
 */
export const getTrendingProducers = async (req: Request, res: Response) => {
	try {
		const page: number = parseInt(req.query?.page as string) || 1;
		const limit: number = parseInt(req.query?.limit as string) || 24;
		const location = (req.query.location as string) || "";

		const { producers, count } = await userServices.getProducers(
			page,
			limit,
			location
		);

		res.status(200).json({
			producers,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error!");
	}
};

/**
 * Responds with popular sound Engineers
 * @param req
 * @param res
 */
export const getTrendingSoundEngineers = async (
	req: Request,
	res: Response
) => {
	try {
		const page: number = parseInt(req.query?.page as string) || 1;
		const limit: number = parseInt(req.query?.limit as string) || 24;
		const location = (req.query.location as string) || "";

		const { engineers, count } = await userServices.getEngineers(
			page,
			limit,
			location
		);

		res.status(200).json({
			engineers,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error!");
	}
};

/**
 * Save beat added by user to database
 * @param req
 * @param res
 * @returns user and message
 */
export const SavedBeats = async (req: Request, res: Response) => {
	try {
		const { beat_id, id } = req.body;
		const user = await userServices.saveBeat(beat_id, id);

		return res.status(200).json({ user, msg: "Beat saved" });
	} catch (error) {
		console.log(getErrorMessage(error));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * Remove beat from user's list of saved beats
 * @param req
 * @param res
 * @returns HTTP RESPONSE
 */
export const RemoveSavedBeat = async (req: Request, res: Response) => {
	try {
		const { beat_id, id } = req.body;
		const user = await userServices.removeSavedBeat(beat_id, id);

		return res.status(200).json({ user, msg: "Beat Removed" });
	} catch (error) {
		console.log(getErrorMessage(error));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * upload profile image and update url to image in the database
 * @params req
 * @params res
 * @returns user profile
 */
export const uploadProfileImage = async (req: Request, res: Response) => {
	try {
		const image = req.file;
		const key = `${req.body.id}-profile`;
		const imgS3Object = await uploadImage(image, key);

		const user = await UserModel.findByIdAndUpdate(req.body.id, {
			imageUrl: imgS3Object.Location,
		});
		if (user) {
			const signedUrl = getSignedUrl(user.imageUrl);
			res.status(203).json({ user, imageUrl: signedUrl });
		}
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * get user details and signedUrl for profile image
 * @param req
 * @param res
 * @returns HTTP response
 */
export const getUserDetails = async (req: Request, res: Response) => {
	try {
		const user = (await UserModel.findOne({ _id: req.body.id }).populate({
			path: "reviews",
			populate: { path: "reviewer" },
		}))?.toObject();

		if (user) {
			if (user.imageUrl && user.imageUrl != "") {
				const signedUrl = getSignedUrl(`image-${req.body.id}-profile`);

				await user.reviews.map(async (review) => {
					if (review.reviewer.imageUrl) {
						// @ts-ignore
						const imageUrl = await getSignedUrl(
							`image-${review.reviewer._id}-profile`
						);
						// @ts-ignore
						review.reviewer.imageUrl = imageUrl;
					}
				});

				return res.status(200).json({ user, imageUrl: signedUrl });
			} else {
				return res.status(200).json({ user, imageUrl: null });
			}
		} else {
			return res.status(400).json({ msg: "User Not found!" });
		}
	} catch (error) {
		console.log(getErrorMessage(error));
		res.status(500).send("Internal Server Error");
	}
};

export const getUserWithName = async (req: Request, res: Response) => {
	try {
		const { name } = req.body;
		const user = await userServices.getUser(name?.toLowerCase());
		if (user) {
			return res.status(200).json(user);
		} else {
			return res.status(404).json({ msg: "user not found!" });
		}
	} catch (error) {
		console.log(getErrorMessage(error));
		res.status(500).send("Internal Server Error");
	}
};
