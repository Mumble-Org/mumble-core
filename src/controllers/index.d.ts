import { Request } from "express";

export interface fileRequest extends Request {
	file?: {
		originalname?: string;
		buffer?: any;
	};
}
