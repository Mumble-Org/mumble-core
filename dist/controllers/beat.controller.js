"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBeat = exports.getBeats = exports.getBeatsById = exports.uploadBeat = void 0;
const errors_util_1 = require("../utils/errors.util");
const s3bucket_util_1 = require("../utils/s3bucket.util");
const beat_model_1 = __importDefault(require("../models/beat.model"));
const lodash_1 = __importDefault(require("lodash"));
/**
 * Define upload route's controller
 * @param req
 * @param res
 */
const uploadBeat = async (req, res) => {
    try {
        // Save audio file to s3
        const filename = req.file?.originalname;
        const s3Object = await (0, s3bucket_util_1.upload)(req.body.id, filename, req);
        const audio = new beat_model_1.default({
            name: req.file?.originalname,
            beatUrl: s3Object?.Location,
            user_id: req.body.id,
            imageUrl: req.body.imageUrl,
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
        const audioKey = `audio-${audio.user_id}-${audio.name}`;
        const signedUrl = (0, s3bucket_util_1.getSignedUrl)(audioKey);
        const audioR = lodash_1.default.omit(audio.toObject(), ["__v"]);
        // Return audio file URL on s3
        res.status(200).json({ audioR, signedUrl });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error");
    }
};
exports.getBeatsById = getBeatsById;
const getBeats = async (req, res) => {
    const page = parseInt(req.query?.page);
    const limit = parseInt(req.query?.limit);
    try {
        // execute query with page and limit values
        const beats = await beat_model_1.default.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await beat_model_1.default.countDocuments();
        res.status(200).json({
            beats,
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
