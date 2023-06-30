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
exports.getSavedBeats = exports.unsaveBeat = exports.saveBeat = exports.getBeatsByUserid = exports.updateBeatPlays = exports.getPopularBeats = exports.getTrendingBeats = exports.deleteBeat = exports.getBeats = exports.getBeatsById = exports.uploadBeat = void 0;
const beatServices = __importStar(require("../services/beat.services"));
const userServices = __importStar(require("../services/user.services"));
const s3bucket_util_1 = require("../utils/s3bucket.util");
const beat_model_1 = __importDefault(require("../models/beat.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const lodash_1 = __importDefault(require("lodash"));
const errors_util_1 = require("../utils/errors.util");
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
        const DataS3Promise = (0, s3bucket_util_1.uploadData)(dataFile, key);
        const AudioS3Promise = (0, s3bucket_util_1.uploadAudio)(AudioFile, key);
        const ImageS3Promise = (0, s3bucket_util_1.uploadImage)(ImageFile, key);
        const ImageS3Object = await ImageS3Promise;
        const AudioS3Object = await AudioS3Promise;
        const DataS3Object = await DataS3Promise;
        // create instance of BeatModel
        const audio = new beat_model_1.default({
            name: title,
            beatUrl: AudioS3Object?.Location,
            user_id: req.body.id,
            imageUrl: ImageS3Object.Location,
            dataUrl: DataS3Object.Location,
            genre: genre.toLowerCase(),
            price: Number(price),
            license,
            key,
        });
        // save to database
        const savedAudio = await audio.save();
        // update producer model
        await user_model_1.default.find({ _id: req.body.id }).updateOne({
            $inc: { beats_uploaded: 1 },
        });
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
        const audioR = await beatServices.getBeatDetails(audio.toObject());
        // Return audio file URL on s3
        return res.status(200).json(audioR);
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
        const audioKey = `audio-${audio.key}`;
        const imageKey = `image-${audio.key}`;
        const dataKey = `data-${audio.key}`;
        try {
            await (0, s3bucket_util_1.deleteFile)(audioKey);
            await (0, s3bucket_util_1.deleteFile)(imageKey);
            await (0, s3bucket_util_1.deleteFile)(dataKey);
            res.status(200).send("audio deleted!");
        }
        catch (err) {
            throw err;
        }
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error");
    }
};
exports.deleteBeat = deleteBeat;
/**
 * get trending beats in database
 * @param req
 * @param res
 */
const getTrendingBeats = async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 24;
    const { price, genre = "" } = req.query;
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        // Get beats created in the last month and sort by plays
        const beats = await beat_model_1.default.find(beatServices.getFindObject(genre, oneMonthAgo))
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(beatServices.getSortOrder(price))
            .sort()
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
exports.getTrendingBeats = getTrendingBeats;
/**
 * get trending beats in database
 * @param req
 * @param res
 */
const getPopularBeats = async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 24;
    const { price, genre = "" } = req.query;
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        // Get beats created in the last year and sort by plays
        const beats = await beat_model_1.default.find(beatServices.getFindObject(genre, oneYearAgo))
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(beatServices.getSortOrder(price))
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
exports.getPopularBeats = getPopularBeats;
/**
 * update number of plays for a beat and total plays for artists, or producers
 * @param req
 * @param res
 * @returns
 */
const updateBeatPlays = async (req, res) => {
    const { id } = req.query;
    try {
        const beat = await beat_model_1.default.findById(id);
        beat.plays += 1;
        beat.save();
        await user_model_1.default.find({ _id: beat.user_id }).updateOne({
            $inc: { total_plays: 1 },
        });
        return res.status(200).json({ status: "ok" });
    }
    catch (err) {
        console.error((0, errors_util_1.getErrorMessage)(err));
        return res.status(500).send("Internal Server Error");
    }
};
exports.updateBeatPlays = updateBeatPlays;
/**
 * Get beats produced by a user
 * @param req
 * @param res
 * @returns
 */
const getBeatsByUserid = async (req, res) => {
    try {
        const { id } = req.query;
        const beats = await beat_model_1.default.find({ user_id: id })
            .sort({ plays: -1 })
            .exec();
        const promises = [];
        for (const beat of beats) {
            promises.push(beatServices.getBeatDetails(beat.toObject()));
        }
        const result = await Promise.all(promises);
        return res.status(200).json(result);
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal server error!");
    }
};
exports.getBeatsByUserid = getBeatsByUserid;
/**
 * Save beat to user's document
 * @param req
 * @param res
 */
const saveBeat = async (req, res) => {
    try {
        const { id } = req.body;
        const { beat_id } = req.query;
        const user = await userServices.getUserById(id);
        if (!user.saved_beats.includes(beat_id)) {
            user.saved_beats.push(beat_id);
            await user.save();
        }
        return res.status(200).json({ message: "Beat saved!" });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal server error!");
    }
};
exports.saveBeat = saveBeat;
/**
 * Unsave beat from user's document
 * @param req
 * @param res
 */
const unsaveBeat = async (req, res) => {
    try {
        const { id } = req.body;
        const { beat_id } = req.query;
        const user = await userServices.getUserById(id);
        user.saved_beats.pull(beat_id);
        await user.save();
        return res.status(200).json({ message: "Beat unsaved!" });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal server error!");
    }
};
exports.unsaveBeat = unsaveBeat;
/**
 * Get saved_beats for a user
 * @param req
 * @param res
 * @returns
 */
const getSavedBeats = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userServices.getUserById(id);
        await user.populate("saved_beats");
        const promises = [];
        for (const beat of user.saved_beats) {
            promises.push(beatServices.getBeatDetails(beat.toObject()));
        }
        const result = await Promise.all(promises);
        return res.status(200).json(result);
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal server error!");
    }
};
exports.getSavedBeats = getSavedBeats;
