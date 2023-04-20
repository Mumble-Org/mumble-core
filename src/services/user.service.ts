import { HydratedDocument } from "mongoose";
import UserModel from "../models/user.model";
import { I_UserDocument } from "../models/";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../middlewares/auth";
import _ from "lodash";

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
			newUser.password = "";
			return {
				user: _.omit(newUser.toObject(), ["createdAt", "updatedAt", "__v"]),
				token: token,
			};
		}
	} catch (error) {
		throw error;
	}
}

/**
 * Convert fields to lowercase
 */
export async function parseUser(user: HydratedDocument<I_UserDocument>) {
	user.name = user.name?.toLowerCase();
	user.email = user.email?.toLowerCase();
	user.genres = user.genres?.map((genre: string) => genre.toLowerCase());
	user.portfolio = user.portfolio?.map((link: string) => link.toLowerCase());
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
			userFound.password = "";
			return { user: _.omit(userFound.toObject(), ["createdAt", "updatedAt", "__v"]), token: token };
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
 * get trending producers from the database
 * @param page 
 * @param limit 
 * @returns producers and no of producers
 */
export async function getProducers(page: number, limit: number) {
	try {
		const producers = await UserModel.find({ type: "producer"})
																			.limit(limit * 1)
																			.skip((page -1 ) * limit)
																			.sort({"total_plays": -1})
																			.exec();
		const count = await UserModel.countDocuments();

		producers.forEach((producer) => {
			producer.password = ""
			producer.__v = "";
		})
		
		return ({producers, count});
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
export async function getEngineers(page: number, limit: number) {
	try {
		const engineers = await UserModel.find({ type: "engineer"})
																			.limit(limit * 1)
																			.skip((page - 1) * limit)
																			.sort({"beats_sold": -1})
																			.exec();
		const count = await UserModel.countDocuments();

		engineers.forEach((engineer) => {
			engineer.password = ""
			engineer.__v = "";
		})

		return ({engineers, count});
	} catch (err) {
		throw err;
	}
}