"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAudioFile = exports.getAudio = exports.uploadAudio = void 0;
const errors_util_1 = require("../utils/errors.util");
const s3bucket_util_1 = require("../utils/s3bucket.util");
const audio_model_1 = __importDefault(require("../models/audio.model"));
const lodash_1 = __importDefault(require("lodash"));
/**
 * Define upload route's controller
 * @param req
 * @param res
 */
const uploadAudio = async (req, res) => {
    try {
        // Save audio file to s3
        const filename = req.file?.originalname;
        const s3Object = await (0, s3bucket_util_1.upload)(req.body.id, filename, req);
        const audio = new audio_model_1.default({
            name: req.file?.originalname,
            audioUrl: s3Object?.Location,
            user_id: req.body.id
        });
        const savedAudio = await audio.save();
        const audioR = lodash_1.default.omit(savedAudio.toObject(), ["__v", "created_at", "updated_at"]);
        res.status(201).json({ audioR });
    }
    catch (err) {
        res.status(500).send('Internal Server Error');
        console.log((0, errors_util_1.getErrorMessage)(err));
    }
};
exports.uploadAudio = uploadAudio;
/**
 * get audio file
 * @param req
 * @param res
 * @returns
 */
const getAudio = async (req, res) => {
    try {
        // Retrieve audio file URL from mongoDB by id
        const audio = await audio_model_1.default.findById(req.body.id);
        if (!audio) {
            return res.status(404).send('Audio not found');
        }
        const audioR = lodash_1.default.omit(audio.toObject(), ["__v"]);
        // Return audio file URL on s3
        res.status(200).json({ audioR });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send('Internal Server Error');
    }
};
exports.getAudio = getAudio;
/**
 * Delete audio from s3 bucket and database
 * @param req
 * @param res
 * @returns
 */
const deleteAudioFile = async (req, res) => {
    try {
        // find audio and delete from database
        const audio = await audio_model_1.default.findOneAndDelete({ audioUrl: req.body.audioUrl });
        if (!audio) {
            return res.status(404).send('Audio not found');
        }
        // delete audio from s3 bucket
        const audioKey = `audio-${audio.user_id}-${audio.name}`;
        const deleted = await (0, s3bucket_util_1.deleteAudio)(audioKey);
        if (deleted) {
            res.status(200).send('audio deleted!');
        }
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send('Internal Server Error');
    }
};
exports.deleteAudioFile = deleteAudioFile;
