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
exports.getUserWithName = exports.getProfileImage = exports.uploadProfileImage = exports.RemoveSavedBeat = exports.SavedBeats = exports.getTrendingSoundEngineers = exports.getTrendingProducers = exports.confirmEmail = exports.confirmUsername = exports.signup = exports.login = void 0;
const errors_util_1 = require("../utils/errors.util");
// import upload from "../utils/s3bucket.utils";
const userServices = __importStar(require("../services/user.service"));
const s3bucket_util_1 = require("../utils/s3bucket.util");
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Logs in a user
 */
const login = async (req, res) => {
    try {
        const user = await userServices.login(req.body);
        res.cookie("Authorization", `Bearer ${user.token}`);
        res.set("Authorization", `Bearer ${user.token}`);
        res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.login = login;
/**
 * Signs up a user
 */
const signup = async (req, res) => {
    try {
        const body = await userServices.parseUser(req.body);
        const user = await userServices.register(body);
        res.cookie("Authorization", `Bearer ${user?.token}`);
        res.set("Authorization", `Bearer ${user?.token}`);
        res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.signup = signup;
/**
 * Confirms username input doesn't exist in the database
 */
const confirmUsername = async (req, res) => {
    try {
        const user = req.body;
        const result = await userServices.checkName(user);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.confirmUsername = confirmUsername;
/**
 * Confirms email input doesn't exist in the database
 */
const confirmEmail = async (req, res) => {
    try {
        const user = req.body;
        const result = await userServices.checkEmail(user);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.confirmEmail = confirmEmail;
/**
 * Responds with trending prodcers
 * @param req
 * @param res
 */
const getTrendingProducers = async (req, res) => {
    try {
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 24;
        const location = req.query.location || "";
        const { producers, count } = await userServices.getProducers(page, limit, location);
        res.status(200).json({
            producers,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error!");
    }
};
exports.getTrendingProducers = getTrendingProducers;
/**
 * Responds with popular sound Engineers
 * @param req
 * @param res
 */
const getTrendingSoundEngineers = async (req, res) => {
    try {
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 24;
        const location = req.query.location || "";
        const { engineers, count } = await userServices.getEngineers(page, limit, location);
        res.status(200).json({
            engineers,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error!");
    }
};
exports.getTrendingSoundEngineers = getTrendingSoundEngineers;
/**
 * Save beat added by user to database
 * @param req
 * @param res
 * @returns user and message
 */
const SavedBeats = async (req, res) => {
    try {
        const { beat_id, id } = req.body;
        const user = await userServices.saveBeat(beat_id, id);
        return res.status(200).json({ user, msg: "Beat saved" });
    }
    catch (error) {
        console.log((0, errors_util_1.getErrorMessage)(error));
        res.status(500).send("Internal Server Error");
    }
};
exports.SavedBeats = SavedBeats;
/**
 * Remove beat from user's list of saved beats
 * @param req
 * @param res
 * @returns HTTP RESPONSE
 */
const RemoveSavedBeat = async (req, res) => {
    try {
        const { beat_id, id } = req.body;
        const user = await userServices.removeSavedBeat(beat_id, id);
        return res.status(200).json({ user, msg: "Beat Removed" });
    }
    catch (error) {
        console.log((0, errors_util_1.getErrorMessage)(error));
        res.status(500).send("Internal Server Error");
    }
};
exports.RemoveSavedBeat = RemoveSavedBeat;
/**
 * upload profile image and update url to image in the database
 * @params req
 * @params res
 * @returns user profile
 */
const uploadProfileImage = async (req, res) => {
    try {
        const image = req.file;
        const key = `${req.body.id}-profile`;
        const imgS3Object = await (0, s3bucket_util_1.uploadImage)(image, key);
        const user = await user_model_1.default.findByIdAndUpdate(req.body.id, {
            imageUrl: imgS3Object.Location,
        });
        if (user) {
            const signedUrl = (0, s3bucket_util_1.getSignedUrl)(user.imageUrl);
            res.status(203).json({ user, imageUrl: signedUrl });
        }
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error");
    }
};
exports.uploadProfileImage = uploadProfileImage;
/**
 * get user details and signedUrl for profile image
 * @param req
 * @param res
 * @returns HTTP response
 */
const getProfileImage = async (req, res) => {
    try {
        const user = await user_model_1.default.findOne({ _id: req.body.id });
        if (user) {
            if (user.imageUrl && user.imageUrl != "") {
                const signedUrl = (0, s3bucket_util_1.getSignedUrl)(`image-${req.body.id}-profile`);
                return res.status(200).json({ user, imageUrl: signedUrl });
            }
            else {
                return res.status(200).json({ user, imageUrl: null });
            }
        }
        else {
            return res.status(400).json({ msg: "User Not found!" });
        }
    }
    catch (error) {
        console.log((0, errors_util_1.getErrorMessage)(error));
        res.status(500).send("Internal Server Error");
    }
};
exports.getProfileImage = getProfileImage;
const getUserWithName = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await userServices.getUser(name?.toLowerCase());
        if (user) {
            return res.status(200).json({ user });
        }
        else {
            return res.status(404).json({ msg: "user not found!" });
        }
    }
    catch (error) {
        console.log((0, errors_util_1.getErrorMessage)(error));
        res.status(500).send("Internal Server Error");
    }
};
exports.getUserWithName = getUserWithName;
