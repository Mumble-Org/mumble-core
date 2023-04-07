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
exports.confirmUsername = exports.signup = exports.login = void 0;
const errors_util_1 = require("../utils/errors.util");
const userServices = __importStar(require("../services/user.service"));
// import { CustomRequest } from '../middleware/auth';
// handles user's signin
const login = async (req, res) => {
    try {
        const user = await userServices.login(req.body);
        res.cookie('Authorization', `Bearer ${user.token}`);
        res.set('Authorization', `Bearer ${user.token}`);
        res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.login = login;
// handles users signup
const signup = async (req, res) => {
    try {
        const token = await userServices.register(req.body);
        res.cookie('Authorization', `Bearer ${token?.token}`);
        res.set('Authorization', `Bearer ${token?.token}`);
        res.status(201).json(token);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.signup = signup;
// Confirms username input doesn't exist in the database
const confirmUsername = async (req, res) => {
    try {
        const user = req.body;
        const result = await userServices.checkName(user);
        return res.status(200).send(result);
    }
    catch (error) {
        return res.status(500).send((0, errors_util_1.getErrorMessage)(error));
    }
};
exports.confirmUsername = confirmUsername;
