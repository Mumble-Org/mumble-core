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
