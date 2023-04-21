"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFindObject = exports.getSortOrder = exports.getBeatDetails = void 0;
const s3bucket_util_1 = require("../utils/s3bucket.util");
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Asynchronously get pre-signed URLs for a beat
 * @param beat
 * @returns
 */
async function getBeatDetails(beat) {
    // get producer asynchronously
    const producerPromise = user_model_1.default.findById(beat.user_id);
    // get audio from s3 bucket
    const audioKey = `audio-${beat.key}`;
    const imageKey = `image-${beat.key}`;
    const audioSignedUrl = (0, s3bucket_util_1.getSignedUrl)(audioKey);
    const imageSignedUrl = (0, s3bucket_util_1.getSignedUrl)(imageKey);
    const { __v, ...beatObj } = beat;
    // await producer promise
    const producer = await producerPromise;
    const ret = { ...beatObj, audioSignedUrl, imageSignedUrl, producer };
    return ret;
}
exports.getBeatDetails = getBeatDetails;
/**
 * Get beat sorting order for user's query
 * @param price user's price query
 * @returns
 */
function getSortOrder(price) {
    let order = {};
    switch (price) {
        case "lowest":
            order = {
                price: 1,
                plays: "desc"
            };
            break;
        case "highest":
            order = {
                price: -1,
                plays: "desc"
            };
            break;
        default:
            order = {
                plays: "desc"
            };
            break;
    }
    return order;
}
exports.getSortOrder = getSortOrder;
function getFindObject(genre, date) {
    switch (genre) {
        case "":
            return {
                createdAt: {
                    $gt: date,
                }
            };
        default:
            return {
                createdAt: {
                    $gt: date,
                },
                genre
            };
    }
}
exports.getFindObject = getFindObject;
