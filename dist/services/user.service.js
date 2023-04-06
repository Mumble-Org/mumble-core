"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkName = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middlewares/auth");
async function register(user) {
    try {
        const newUser = new user_model_1.default(user);
        await newUser.save();
    }
    catch (error) {
        throw error;
    }
}
exports.register = register;
async function login(user) {
    try {
        const userFound = await user_model_1.default.findOne({ name: user.name });
        if (!userFound) {
            throw new Error("User doesn't exist");
        }
        const isMatch = bcrypt_1.default.compareSync(user.password, userFound.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ _id: userFound._id?.toString(),
                name: userFound.name }, auth_1.SECRET_KEY, {
                expiresIn: '2 days',
            });
            userFound.password = "";
            return { user: userFound, token: token };
        }
        else {
            throw new Error('Password is not correct');
        }
    }
    catch (error) {
        throw error;
    }
}
exports.login = login;
async function checkName(user) {
    try {
        const userFound = await user_model_1.default.findOne({ name: user.name });
        if (userFound) {
            return { 'value': 'true', 'message': 'User already exist!' };
        }
        else {
            return { 'value': 'false', 'message': 'Username is available!' };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.checkName = checkName;
