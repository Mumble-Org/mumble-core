import { Request, Response } from "express";
import { getErrorMessage } from "../utils/errors.util";
import {
	deleteFile,
	getSignedUrl,
	uploadAudio,
	uploadImage,
	uploadData,
} from "../utils/s3bucket.util";
import BeatModel from "../models/beat.model";
import _ from "lodash";
import { fileRequest } from ".";
import * as beatServices from "../services/beat.services";

/**
 * Define upload route's controller
 * @param req
 * @param res
 */
export const uploadBeat = async (req: fileRequest, res: Response) => {
	try {
		// Save audio file to s3
		const { id, title, genre, license, price } = req.body;
		const key = `${id}-${title}-${Date.now()}`;
		const file = req.files as { [fieldname: string]: Express.Multer.File[] };
		const AudioFile = file["audio"][0];
		const ImageFile = file["image"][0];
		const dataFile = file["data"][0];
		const DataS3Promise = uploadData(id, title, dataFile, key);
		const AudioS3Promise = uploadAudio(id, title, AudioFile, key);
		const ImageS3Promise = uploadImage(id, title, ImageFile, key);

		const ImageS3Object = await ImageS3Promise;
		const AudioS3Object = await AudioS3Promise;
		const DataS3Object = await DataS3Promise;


		// create instance of BeatModel
		const audio = new BeatModel({
			name: title,
			beatUrl: AudioS3Object?.Location,
			user_id: req.body.id,
			imageUrl: ImageS3Object.Location,
			dataUrl: DataS3Object.Location,
			genre,
			price: Number(price),
			license,
			key,
		});

		// save to database
		const savedAudio = await audio.save();
		const audioR = _.omit(savedAudio.toObject(), [
			"__v",
			"created_at",
			"updated_at",
		]);

		res.status(201).json({ audioR });
	} catch (err) {
		res.status(500).send("Internal Server Error");
		console.log(getErrorMessage(err));
	}
};

/**
 * get audio file
 * @param req
 * @param res
 * @returns
 */
export const getBeatsById = async (req: Request, res: Response) => {
	try {
		// Retrieve audio file URL from mongoDB by id
		const audio = await BeatModel.findById(req.params.id);
		if (!audio) {
			return res.status(404).send("Audio not found");
		}

		// get audio from s3 bucket
		const audioKey = `audio-${audio.key}`;
		const imageKey = `image-${audio.key}`;
		const dataKey = `data-${audio.key}`;

		const audioSignedUrl = getSignedUrl(audioKey);
		const imageSignedUrl = getSignedUrl(imageKey);
		const dataSignedUrl = getSignedUrl(dataKey);

		const audioR = _.omit(audio.toObject(), ["__v"]);

		// Return audio file URL on s3
		res
			.status(200)
			.json({ audioR, audioSignedUrl, imageSignedUrl, dataSignedUrl });
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * get all beats in database
 * @param req
 * @param res
 */
export const getBeats = async (req: Request, res: Response) => {
	const page: number = parseInt(req.query?.page as string) || 1;
	const limit: number = parseInt(req.query?.limit as string) || 20;
	try {
		// execute query with page and limit values
		const beats = await BeatModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.exec();
		const count = await BeatModel.countDocuments();

		// Get URLs
		const promises = [];
		for (const beat of beats) {
			promises.push(beatServices.getBeatDetails(beat.toObject()));
		}
		const ret = await Promise.all(promises);

		res.status(200).json({
			beats: ret,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (err) {
		console.error(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * Delete audio from s3 bucket and database
 * @param req
 * @param res
 * @returns
 */
export const deleteBeat = async (req: Request, res: Response) => {
	try {
		// find audio and delete from database
		const audio = await BeatModel.findOneAndDelete({
			beatUrl: req.body.beatUrl,
		});

		if (!audio) {
			return res.status(404).send("Audio not found");
		}

		// delete audio from s3 bucket
		const audioKey = `audio-${audio.key}`;
		const imageKey = `image-${audio.key}`;
		const dataKey = `data-${audio.key}`;

		try {
			await deleteFile(audioKey);
			await deleteFile(imageKey);
			await deleteFile(dataKey);
			res.status(200).send("audio deleted!");
		} catch (err) {
			throw err;
		}
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * get trending beats in database
 * @param req
 * @param res
 */
export const getTrendingBeats = async (req: Request, res: Response) => {
	const page: number = parseInt(req.query?.page as string) || 1;
	const limit: number = parseInt(req.query?.limit as string) || 24;
	try {
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		// Get beats created in the last month and sort by plays
		const beats = await BeatModel.find({
			createdAt: {
				$gt: oneMonthAgo,
			}
		})
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({plays: 'desc'})
			.exec();
		const count = await BeatModel.countDocuments();

		// Get URLs
		const promises = [];
		for (const beat of beats) {
			promises.push(beatServices.getBeatDetails(beat.toObject()));
		}
		const ret = await Promise.all(promises);

		res.status(200).json({
			beats: ret,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (err) {
		console.error(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};

/**
 * get trending beats in database
 * @param req
 * @param res
 */
export const getPopularBeats = async (req: Request, res: Response) => {
	const page: number = parseInt(req.query?.page as string) || 1;
	const limit: number = parseInt(req.query?.limit as string) || 24;
	try {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
		// Get beats created in the last year and sort by plays
		const beats = await BeatModel.find({
			createdAt: {
				$gt: oneYearAgo,
			}
		})
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({plays: 'desc'})
			.exec();
		const count = await BeatModel.countDocuments();

		// Get URLs
		const promises = [];
		for (const beat of beats) {
			promises.push(beatServices.getBeatDetails(beat.toObject()));
		}
		const ret = await Promise.all(promises);

		res.status(200).json({
			beats: ret,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (err) {
		console.error(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};

export const updateBeatPlays = async (req: Request, res: Response) => {
	const { id } = req.query;

	try {
		const beat = await BeatModel.findById(id);
		beat.plays += 1;
		beat.save();

		return res.status(200).json({ status: 'ok' });
	} catch (err) {
		console.error(getErrorMessage(err));
		return res.status(500).send("Internal Server Error");
	}
}
