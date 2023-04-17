"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUrls = void 0;
const s3bucket_util_1 = require("../utils/s3bucket.util");
/**
 * Asynchronously get pre-signed URLs for a beat
 * @param beat
 * @returns
 */
async function getSignedUrls(beat) {
    // get audio from s3 bucket
    const audioKey = `audio-${beat.user_id}-${beat.name}`;
    const imageKey = `image-${beat.user_id}-${beat.name}`;
    const audioSignedUrl = (0, s3bucket_util_1.getSignedUrl)(audioKey);
    const imageSignedUrl = (0, s3bucket_util_1.getSignedUrl)(imageKey);
    const { __v, ...beatObj } = beat;
    const ret = { ...beatObj, audioSignedUrl, imageSignedUrl };
    return ret;
}
exports.getSignedUrls = getSignedUrls;
