import { getSignedUrl } from "../utils/s3bucket.util";
import { Beat } from ".";

/**
 * Asynchronously get pre-signed URLs for a beat
 * @param beat 
 * @returns 
 */
export async function getSignedUrls(beat: Beat) {
	// get audio from s3 bucket
	const audioKey = `audio-${beat.user_id}-${beat.name}`;
	const imageKey = `image-${beat.user_id}-${beat.name}`;

	const audioSignedUrl = getSignedUrl(audioKey);
	const imageSignedUrl = getSignedUrl(imageKey);

	const { __v, ...beatObj } = beat;
	const ret = { ...beatObj, audioSignedUrl, imageSignedUrl };

	return ret;
}
