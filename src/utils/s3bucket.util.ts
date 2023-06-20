import AWS from "aws-sdk";

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
 * @param id user id
 * @param title beat title
 * @param file file to upload
 * @param key key
 * @returns promise
 */
export const uploadAudio = (file: Express.Multer.File, key: string) => {
	try {
		const params = {
			Bucket: bucket,
			Key: `audio-${key}`,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		return s3Client.upload(params).promise();
	} catch (err) {
		console.log(err);
	}
};

/**
 * upload image to s3 bucket
 * @param file file to upload
 * @param key key
 * @returns promise
 */
export const uploadImage = (file: Express.Multer.File, key: string) => {
	try {
		const params = {
			Bucket: bucket,
			Key: `image-${key}`,
			Body: file?.buffer,
			ContentType: file.mimetype,
		};

		return s3Client.upload(params).promise();
	} catch (err) {
		console.log(err);
	}
};

/**
 * upload beat data to s3 bucket
 * @param file file to upload
 * @param key key
 * @returns promise
 */
export const uploadData = (file: Express.Multer.File, key: string) => {
	try {
		const params = {
			Bucket: bucket,
			Key: `data-${key}`,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		return s3Client.upload(params).promise();
	} catch (err) {
		console.log(err);
	}
};

/**
 * delete audio from s3 bucket
 * @param beatUrl
 * @returns promise
 */
export const deleteFile = (beatUrl: string) => {
	const params = {
		Bucket: bucket,
		Key: beatUrl,
	};

	return s3Client.deleteObject(params).promise();
};

/**
 * Get temporary signed url to access bucket
 * 
 * @params key `image-${user.id}-profile`
 */
export const getSignedUrl = (key: string) => {
	const params = {
		Bucket: bucket,
		Key: key,
		Expires: 60 * 60 * 24 * 2,
	};

	return s3Client.getSignedUrl("getObject", params);
};
