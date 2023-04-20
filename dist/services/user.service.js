"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducers = exports.checkEmail = exports.checkName = exports.login = exports.parseUser = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middlewares/auth");
const lodash_1 = __importDefault(require("lodash"));
async function register(user) {
    try {
        const newUser = await user_model_1.default.create(user);
        if (!newUser) {
            throw new Error("Error occured while creating account");
        }
        if (newUser) {
            const token = jsonwebtoken_1.default.sign({ _id: newUser._id?.toString(), name: newUser.name }, auth_1.SECRET_KEY, {
                expiresIn: "2 days",
            });
            newUser.password = "";
            return {
                user: lodash_1.default.omit(newUser.toObject(), ["createdAt", "updatedAt", "__v"]),
                token: token,
            };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.register = register;
/**
 * Convert fields to lowercase
 */
async function parseUser(user) {
    user.name = user.name?.toLowerCase();
    user.email = user.email?.toLowerCase();
    user.genres = user.genres?.map((genre) => genre.toLowerCase());
    user.portfolio = user.portfolio?.map((link) => link.toLowerCase());
    return user;
}
exports.parseUser = parseUser;
async function login(user) {
    try {
        const userFound = await user_model_1.default.findOne({
            email: user.email.toLowerCase(),
        });
        if (!userFound) {
            throw new Error("User doesn't exist");
        }
        const isMatch = bcrypt_1.default.compareSync(user.password, userFound.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ _id: userFound._id?.toString(), name: userFound.name }, auth_1.SECRET_KEY, {
                expiresIn: "2 days",
            });
            userFound.password = "";
            return { user: lodash_1.default.omit(userFound.toObject(), ["createdAt", "updatedAt", "__v"]), token: token };
        }
        else {
            throw new Error("Password is not correct");
        }
    }
    catch (error) {
        throw error;
    }
}
exports.login = login;
async function checkName(user) {
    try {
        const userFound = await user_model_1.default.findOne({
            name: user.name.toLowerCase(),
        });
        if (userFound) {
            return { value: true, message: "User already exists!" };
        }
        else {
            return { value: false, message: "Username is available!" };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.checkName = checkName;
async function checkEmail(user) {
    try {
        const userFound = await user_model_1.default.findOne({
            email: user.email.toLowerCase(),
        });
        if (userFound) {
            return { value: true, message: "Email already exists!" };
        }
        else {
            return { value: false, message: "Email is available!" };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.checkEmail = checkEmail;
/**
 * get trending producers from the database
 * @param page
 * @param limit
 * @returns producers and no of producers
 */
async function getProducers(page, limit) {
    try {
        const producers = await user_model_1.default.find({ type: "producers" })
            .sort({ "beats_sold": -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await user_model_1.default.countDocuments();
        return ({ producers, count });
    }
    catch (error) {
        throw error;
    }
}
exports.getProducers = getProducers;
