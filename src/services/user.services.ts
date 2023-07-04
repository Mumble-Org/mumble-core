import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import UserModel from "../models/user.model";
import { SECRET_KEY } from "../middlewares/auth";
import { getSignedUrl } from "../utils/s3bucket.util";
import { I_UserDocument } from "../models";

/**
 * Create user
 * @param user
 * @returns
 */
export async function register(user: HydratedDocument<I_UserDocument>) {
	try {
		const newUser = await UserModel.create(user);

		if (!newUser) {
			throw new Error("Error occured while creating account");
		}
		if (newUser) {
			const token = jwt.sign(
				{ _id: newUser._id?.toString(), name: newUser.name },
				SECRET_KEY,
				{
					expiresIn: "2 days",
				}
			);
			return {
				user: _.omit(newUser.toObject(), [
					"createdAt",
					"updatedAt",
					"__v",
					"password",
				]),
				token: token,
			};
		}
	} catch (error) {
		throw error;
	}
}

/**
 * Update user profile
 * @param body
 */
export async function updateUser(body: HydratedDocument<I_UserDocument>) {
	try {
		// Get user
		let user = await UserModel.findById(body.id);

		if (!user) throw new Error("User not found");

		// Input validation
		if (!body.portfolio || !Array.isArray(body.portfolio)) {
			throw new Error("Invalid portfolio data");
		}


		// Push the new portfolio items to the user's portfolio
		await UserModel.updateOne({ _id: body.id }, {
			$set: { portfolio: body.portfolio },
		}).catch((error) => {
			throw error;
		});

		body.portfolio = undefined;

		// Update user
		await UserModel.updateOne({ _id: body.id }, body);

		user = await UserModel.findById(body.id);

		if (!user) {
      throw new Error("Failed to retrieve updated user");
    }

		return _.omit(user.toObject(), ["createdAt", "updatedAt", "__v", "password"]);

	} catch (error) {
		if (error instanceof Error) throw new Error(`Failed to Update user: ${error.message}`);
	}
}

/**
 * Convert fields to lowercase
 */
export async function parseUser(user: HydratedDocument<I_UserDocument>) {
	user.name = user.name?.toLowerCase();
	user.email = user.email?.toLowerCase();
	user.genres = user.genres?.map((genre: string) => genre.toLowerCase());
	return user;
}

export async function login(user: HydratedDocument<I_UserDocument>) {
	try {
		const userFound = await UserModel.findOne({
			email: user.email.toLowerCase(),
		});

		if (!userFound) {
			throw new Error("User doesn't exist");
		}

		const isMatch = bcrypt.compareSync(user.password, userFound.password);

		if (isMatch) {
			const token = jwt.sign(
				{ _id: userFound._id?.toString(), name: userFound.name },
				SECRET_KEY,
				{
					expiresIn: "2 days",
				}
			);

			// Get profile picture
			userFound.imageUrl && userFound.imageUrl != ""
				? (userFound.imageUrl = await getSignedUrl(
						`image-${userFound._id.toString()}-profile`
				  ))
				: "";

			return {
				user: _.omit(userFound.toObject(), [
					"createdAt",
					"updatedAt",
					"__v",
					"password",
				]),
				token: token,
			};
		} else {
			throw new Error("Password is not correct");
		}
	} catch (error) {
		throw error;
	}
}

export async function checkName(user: HydratedDocument<I_UserDocument>) {
	try {
		const userFound = await UserModel.findOne({
			name: user.name.toLowerCase(),
		});
		if (userFound) {
			return { value: true, message: "User already exists!" };
		} else {
			return { value: false, message: "Username is available!" };
		}
	} catch (error) {
		throw error;
	}
}

/**
 * confirm if user with the current email exists
 * @param user
 * @returns
 */
export async function checkEmail(user: HydratedDocument<I_UserDocument>) {
	try {
		const userFound = await UserModel.findOne({
			email: user.email.toLowerCase(),
		});
		if (userFound) {
			return { value: true, message: "Email already exists!" };
		} else {
			return { value: false, message: "Email is available!" };
		}
	} catch (error) {
		throw error;
	}
}

/**
 * Get user with username from database
 * @param username
 * @returns
 */
export async function getUser(username: string) {
	try {
		const user = await UserModel.findOne({ name: username }).populate({
				path: "reviews",
				populate: { path: "reviewer" },
		})
		.exec();
		
		if (!user) {
			throw new Error('Could not retrieve user');
		}

		const userObj = user.toObject();

		if (userObj && userObj.imageUrl) {
			userObj.imageUrl = await getSignedUrl(
				`image-${userObj._id.toString()}-profile`
			);
		}

		// Iterate over 'reviews' array using a regular 'for' loop
		for (let i = 0; i < user.reviews.length; i++) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const review: any = userObj.reviews[i];

			if (review.reviewer.imageUrl) {
				const imageUrl = await getSignedUrl(
					`image-${review.reviewer._id}-profile`
				);
				review.reviewer.imageUrl = imageUrl;
			}
		}

		return userObj;
	} catch (error) {
		throw error;
	}
}

/**
 * get trending producers from the database
 * @param page
 * @param limit
 * @returns producers and no of producers
 */
export async function getProducers(
	page: number,
	limit: number,
	location: string
) {
	try {
		let producers;
		if (location && location != "") {
			producers = await UserModel.find({ type: "producer", location: location })
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.sort({ total_plays: -1 })
				.exec();
		} else {
			producers = await UserModel.find({ type: "producer" })
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.sort({ total_plays: -1 })
				.exec();
		}
		const count = await UserModel.countDocuments();

		producers.forEach(async (producer) => {
			producer.imageUrl === "" || producer.imageUrl === undefined
				? (producer.imageUrl = "")
				: (producer.imageUrl = await getSignedUrl(
						`image-${producer._id.toString()}-profile`
				  ));
			producer.password = "";
			producer.__v = "";
		});

		return { producers, count };
	} catch (error) {
		throw error;
	}
}

/**
 * get producers from db and sort based on sold beats and mixes
 * @param page
 * @param limit
 * @returns engineers and count
 */
export async function getEngineers(
	page: number,
	limit: number,
	location: string
) {
	try {
		let engineers;
		if (location && location != "") {
			engineers = await UserModel.find({ type: "engineer", location: location })
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.sort({ beats_sold: -1 })
				.exec();
		} else {
			engineers = await UserModel.find({ type: "engineer" })
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.sort({ beats_sold: -1 })
				.exec();
		}

		const count = await UserModel.countDocuments();

		engineers.forEach(async (engineer) => {
			engineer.imageUrl === "" || engineer.imageUrl === undefined
				? (engineer.imageUrl = "")
				: (engineer.imageUrl = await getSignedUrl(
						`image-${engineer._id.toString()}-profile`
				  ));
			engineer.password = "";
			engineer.__v = "";
		});

		return { engineers, count };
	} catch (err) {
		throw err;
	}
}

/**
 * Save beat to user document in database
 * @param beat_id
 * @param user_id
 * @returns
 */
export async function saveBeat(beat_id: string, user_id: string) {
	try {
		const user = await UserModel.findById(user_id);
		user.saved_beats.push(beat_id);
		user.save();

		return { user: _.omit(user.toObject(), ["__v", "password"]) };
	} catch (error) {
		throw error;
	}
}

/**
 * Remove beat from list of saved beat in database
 * @param beat_id
 * @param user_id
 * @returns User object
 */
export async function removeSavedBeat(beat_id: string, user_id: string) {
	try {
		const user = await UserModel.findById(user_id);
		user.saved_beats.filter((beat) => {
			beat.toString() != beat_id;
		});

		user.save();

		return { user: _.omit(user.toObject(), ["__v", "password"]) };
	} catch (error) {
		throw error;
	}
}

/**
 * Get user by id
 * @param id User id
 * @returns user object
 */
export async function getUserById(id: string) {
	try {
		return await UserModel.findById(id);
	} catch (error) {
		throw error;
	}
}
