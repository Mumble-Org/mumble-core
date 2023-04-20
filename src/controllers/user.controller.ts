import { Request, Response } from "express";
import { getErrorMessage } from "../utils/errors.util";
import * as userServices from "../services/user.service";


/**
 * Logs in a user
 */
export const login = async (req: Request, res: Response) => {
	try {
		const user = await userServices.login(req.body);
		res.cookie("Authorization", `Bearer ${user.token}`);
		res.set("Authorization", `Bearer ${user.token}`);
		res.status(200).json({user});
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
		const limit: number = parseInt(req.query?.page as string) || 24;

		const { producers, count } = await userServices.getProducers(page, limit);

		res.status(200).json({
			producers,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error!");
	}
}


/**
 * Responds with popular sound Engineers
 * @param req 
 * @param res 
 */
export const getSoundEngineers = async (req: Request, res: Response) => {
	try {
		const page: number = parseInt(req.query?.page as string) || 1;
		const limit: number = parseInt(req.query?.page as string) || 24;

		const {engineers, count} = await userServices.getEngineers(page, limit);

		res.status(200).json({
			engineers,
			totalPages: Math.ceil(count / limit),
			currentPage: page
		})
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error!");
	}
}