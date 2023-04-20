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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoundEngineers = exports.getTrendingProducers = exports.confirmEmail = exports.confirmUsername = exports.signup = exports.login = void 0;
const errors_util_1 = require("../utils/errors.util");
const userServices = __importStar(require("../services/user.service"));
/**
 * Logs in a user
 */
const login = async (req, res) => {
    try {
        const user = await userServices.login(req.body);
        res.cookie("Authorization", `Bearer ${user.token}`);
        res.set("Authorization", `Bearer ${user.token}`);
        res.status(200).json({ user });
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
        const { producers, count } = await userServices.getProducers(page, limit);
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
const getSoundEngineers = async (req, res) => {
    try {
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 24;
        const { engineers, count } = await userServices.getEngineers(page, limit);
        res.status(200).json({
            engineers,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    }
    catch (err) {
        console.log((0, errors_util_1.getErrorMessage)(err));
        res.status(500).send("Internal Server Error!");
    }
};
exports.getSoundEngineers = getSoundEngineers;
