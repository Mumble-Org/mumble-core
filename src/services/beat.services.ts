import { getSignedUrl } from "../utils/s3bucket.util";
import UserModel from "../models/user.model";
import { Beat } from ".";

/**
 * Asynchronously get pre-signed URLs for a beat
 * @param beat 
 * @returns 
 */
export async function getBeatDetails(beat: Beat) {
	// get producer asynchronously
	const producerPromise = UserModel.findById(beat.user_id);

	// get audio from s3 bucket
	const audioKey = `audio-${beat.key}`;
	const imageKey = `image-${beat.key}`;

	const audioSignedUrl = getSignedUrl(audioKey);
	const imageSignedUrl = getSignedUrl(imageKey);

	const { __v, ...beatObj } = beat;

	// await producer promise
	const producer = await producerPromise;

	const ret = { ...beatObj, audioSignedUrl, imageSignedUrl, producer };

	return ret;
}
