import AWS from "aws-sdk";
import { fileRequest } from "../controllers";

const region = process.env.REGION;
const bucket = process.env.MUMBLE_BUCKET || "mumbleaudios";
const accessKeyId = process.env.MUMBLE_AWS_ACCESS_KEY;
const secretAccessKey = process.env.MUMBLE_AWS_SECRET_ACCESS_KEY;

/**
 * Set up AWS S3 Client
 */

export const s3Client = new AWS.S3({
	region,
	accessKeyId,
	secretAccessKey,
});

/**
 * get audio from s3 bucket
 * @param beatUrl
 * @returns promise
 */
export const downloadAudio = (beatUrl: string) => {
	const params = {
		Key: beatUrl,
		Bucket: bucket,
	};

	return s3Client
		.getObject(params, (err: any) => {
			console.log(err);
		})
		.promise();
};

/**
 * upload audio to s3 bucket
 * @param req
 * @returns promise
 */
export const upload = (
	id: string,
	filename: string | undefined,
	req: fileRequest
) => {
	try {

		if (filename != undefined && id) {
			const params = {
				Bucket: bucket,
				Key: `audio-${id}-${filename}`,
				Body: req.file?.buffer,
			};

			return s3Client.upload(params).promise();
		}
	} catch (err) {
		console.log(err);
	}
};

/**
 * delete audio from s3 bucket
 * @param beatUrl
 * @returns promise	
 */
export const deleteAudio = (beatUrl: string) => {
	const params = {
		Bucket: bucket,
		Key: beatUrl,
	};

	return s3Client.deleteObject(params).promise();
};

/**
 * Get temporary signed url to access bucket
 */
export const getSignedUrl = (key: string) => {
	const params = {
		Bucket: bucket,
		Key: key,
		Expires: 3600,
	};

	return s3Client.getSignedUrl("getObject", params);
};
