import { Request, Response } from "express";
import { getErrorMessage } from "../utils/errors.util";
import { deleteAudio, getSignedUrl, uploadAudio, uploadImage } from "../utils/s3bucket.util";
import BeatModel from "../models/beat.model";
import _ from "lodash";
import { fileRequest } from ".";


/**
 * Define upload route's controller
 * @param req
 * @param res
 */
export const uploadBeat = async (req: fileRequest, res: Response) => {
	try {
		// Save audio file to s3
		const file = req.files as { [fieldname: string]: Express.Multer.File[]};
		const AudioFile = file['audio'][0];
		const ImageFile = file['image'][0];
		const AudioS3Object = await uploadAudio(req.body.id, req.body.title, AudioFile);
		const ImageS3Object = await uploadImage(req.body.id, req.body.title, ImageFile);

		const audio = new BeatModel({
			name: req.body.title,
			beatUrl: AudioS3Object?.Location,
			user_id: req.body.id,
			imageUrl: ImageS3Object.Location
		});

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
		const audioKey = `audio-${audio.user_id}-${audio.name}`;
		const imageKey = `image-${audio.user_id}-${audio.name}`;

		const audioSignedUrl = getSignedUrl(audioKey);
		const imageSignedUrl = getSignedUrl(imageKey);

		const audioR = _.omit(audio.toObject(), ["__v"]);

		// Return audio file URL on s3
		res.status(200).json({ audioR, audioSignedUrl, imageSignedUrl });
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
	const page: number = parseInt(req.query?.page as string);
	const limit: number = parseInt(req.query?.limit as string);
	try {
		// execute query with page and limit values
		const beats = await BeatModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.exec();
		const count = await BeatModel.countDocuments();

		res.status(200).json({
			beats,
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
		const audioKey = `audio-${audio.user_id}-${audio.name}`;

		const deleted = await deleteAudio(audioKey);
		if (deleted) {
			res.status(200).send("audio deleted!");
		}
	} catch (err) {
		console.log(getErrorMessage(err));
		res.status(500).send("Internal Server Error");
	}
};
