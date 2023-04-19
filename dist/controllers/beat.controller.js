"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBeat = exports.getBeats = exports.getBeatsById = exports.uploadBeat = void 0;
const errors_util_1 = require("../utils/errors.util");
const s3bucket_util_1 = require("../utils/s3bucket.util");
const beat_model_1 = __importDefault(require("../models/beat.model"));
const lodash_1 = __importDefault(require("lodash"));
const beatServices = __importStar(require("../services/beat.services"));
/**
 * Define upload route's controller
 * @param req
 * @param res
 */
const uploadBeat = async (req, res) => {
    try {
        // Save audio file to s3
        const { id, title, genre, license, price } = req.body;
        const key = `${id}-${title}-${Date.now()}`;
        const file = req.files;
        const AudioFile = file["audio"][0];
        const ImageFile = file["image"][0];
        const dataFile = file["data"][0];
        const DataS3Promise = (0, s3bucket_util_1.uploadData)(id, title, dataFile, key);
        const AudioS3Promise = (0, s3bucket_util_1.uploadAudio)(id, title, AudioFile, key);
        const ImageS3Promise = (0, s3bucket_util_1.uploadImage)(id, title, ImageFile, key);
        const ImageS3Object = await ImageS3Promise;
        const AudioS3Object = await AudioS3Promise;
        const DataS3Object = await DataS3Promise;
        const audio = new beat_model_1.default({
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
        const savedAudio = await audio.save();
        const audioR = lodash_1.default.omit(savedAudio.toObject(), [
            "__v",
            "created_at",
            "updated_at",
        ]);
        res.status(201).json({ audioR });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
        console.log((0, errors_util_1.getErrorMessage)(err));
    }
};
exports.uploadBeat = uploadBeat;
/**
 * get audio file
 * @param req
 * @param res
 * @returns
 */
const getBeatsById = async (req, res) => {
    try {
        // Retrieve audio file URL from mongoDB by id
        const audio = await beat_model_1.default.findById(req.params.id);
        if (!audio) {
            return res.status(404).send("Audio not found");
        }
        // get audio from s3 bucket
        const audioKey = `audio-${audio.key}`;
        const imageKey = `image-${audio.key}`;
        const dataKey = `data-${audio.key}`;
        const audioSignedUrl = (0, s3bucket_util_1.getSignedUrl)(audioKey);
        const imageSignedUrl = (0, s3bucket_util_1.getSignedUrl)(imageKey);
        const dataSignedUrl = (0, s3bucket_util_1.getSignedUrl)(dataKey);
        const audioR = lodash_1.default.omit(audio.toObject(), ["__v"]);
        // Return audio file URL on s3
        res.status(200).json({ audioR, audioSignedUrl, imageSignedUrl, dataSignedUrl });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error");
    }
};
exports.getBeatsById = getBeatsById;
/**
 * get all beats in database
 * @param req
 * @param res
 */
const getBeats = async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 20;
    try {
        // execute query with page and limit values
        const beats = await beat_model_1.default.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await beat_model_1.default.countDocuments();
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
    }
    catch (err) {
        console.error((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error");
    }
};
exports.getBeats = getBeats;
/**
 * Delete audio from s3 bucket and database
 * @param req
 * @param res
 * @returns
 */
const deleteBeat = async (req, res) => {
    try {
        // find audio and delete from database
        const audio = await beat_model_1.default.findOneAndDelete({
            beatUrl: req.body.beatUrl,
        });
        if (!audio) {
            return res.status(404).send("Audio not found");
        }
        // delete audio from s3 bucket
        const audioKey = `audio-${audio.user_id}-${audio.name}`;
        const deleted = await (0, s3bucket_util_1.deleteAudio)(audioKey);
        if (deleted) {
            res.status(200).send("audio deleted!");
        }
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error");
    }
};
exports.deleteBeat = deleteBeat;
