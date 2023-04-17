"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUrl = exports.deleteAudio = exports.uploadImage = exports.uploadAudio = exports.downloadAudio = exports.s3Client = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const region = process.env.REGION;
const bucket = process.env.MUMBLE_BUCKET || "mumbleaudios";
const accessKeyId = process.env.MUMBLE_AWS_ACCESS_KEY;
const secretAccessKey = process.env.MUMBLE_AWS_SECRET_ACCESS_KEY;
/**
 * Set up AWS S3 Client
 */
exports.s3Client = new aws_sdk_1.default.S3({
    region,
    accessKeyId,
    secretAccessKey,
});
/**
 * get audio from s3 bucket
 * @param beatUrl
 * @returns promise
 */
const downloadAudio = (beatUrl) => {
    const params = {
        Key: beatUrl,
        Bucket: bucket,
    };
    return exports.s3Client
        .getObject(params, (err) => {
        console.log(err);
    })
        .promise();
};
exports.downloadAudio = downloadAudio;
/**
 * upload audio to s3 bucket
 * @param req
 * @returns promise
 */
const uploadAudio = (id, title, file) => {
    try {
        if (title != undefined && id) {
            const params = {
                Bucket: bucket,
                Key: `audio-${id}-${title}`,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            return exports.s3Client.upload(params).promise();
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.uploadAudio = uploadAudio;
/**
 * upload image to s3 bucket
 * @param id
 * @param title
 * @param file
 * @returns promise
 */
const uploadImage = (id, title, file) => {
    try {
        if (title != undefined && id) {
            const params = {
                Bucket: bucket,
                Key: `image-${id}-${title}`,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            return exports.s3Client.upload(params).promise();
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.uploadImage = uploadImage;
/**
 * delete audio from s3 bucket
 * @param beatUrl
 * @returns promise
 */
const deleteAudio = (beatUrl) => {
    const params = {
        Bucket: bucket,
        Key: beatUrl,
    };
    return exports.s3Client.deleteObject(params).promise();
};
exports.deleteAudio = deleteAudio;
/**
 * Get temporary signed url to access bucket
 */
const getSignedUrl = (key) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Expires: 3600,
    };
    return exports.s3Client.getSignedUrl("getObject", params);
};
exports.getSignedUrl = getSignedUrl;
