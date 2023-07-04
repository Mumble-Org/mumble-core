"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.removeSavedBeat = exports.saveBeat = exports.getEngineers = exports.getProducers = exports.getUser = exports.checkEmail = exports.checkName = exports.login = exports.parseUser = exports.updateUser = exports.register = void 0;
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_1 = require("../middlewares/auth");
const s3bucket_util_1 = require("../utils/s3bucket.util");
/**
 * Create user
 * @param user
 * @returns
 */
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
            return {
                user: lodash_1.default.omit(newUser.toObject(), [
                    "createdAt",
                    "updatedAt",
                    "__v",
                    "password",
                ]),
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
 * Update user profile
 * @param body
 */
async function updateUser(body) {
    try {
        // Get user
        let user = await user_model_1.default.findById(body.id);
        if (!user)
            throw new Error("User not found");
        // Input validation
        if (!body.portfolio || !Array.isArray(body.portfolio)) {
            throw new Error("Invalid portfolio data");
        }
        const existingPortfolio = user.portfolio;
        // Filter out existing portfolio items that already exist in the incoming portfolio
        const newPortfolioItems = body.portfolio.filter((item) => !existingPortfolio.some((existingItem) => existingItem === item));
        // Push the new portfolio items to the user's portfolio
        if (newPortfolioItems.length > 0) {
            await user_model_1.default.updateOne({ _id: body.id }, {
                $push: { portfolio: { $each: newPortfolioItems } },
            }).catch((error) => {
                throw error;
            });
        }
        body.portfolio = undefined;
        // Update user
        await user_model_1.default.updateOne({ _id: body.id }, body);
        user = await user_model_1.default.findById(body.id);
        if (!user) {
            throw new Error("Failed to retrieve updated user");
        }
        return lodash_1.default.omit(user.toObject(), ["createdAt", "updatedAt", "__v", "password"]);
    }
    catch (error) {
        if (error instanceof Error)
            throw new Error(`Failed to Update user: ${error.message}`);
    }
}
exports.updateUser = updateUser;
/**
 * Convert fields to lowercase
 */
async function parseUser(user) {
    user.name = user.name?.toLowerCase();
    user.email = user.email?.toLowerCase();
    user.genres = user.genres?.map((genre) => genre.toLowerCase());
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
            // Get profile picture
            userFound.imageUrl && userFound.imageUrl != ""
                ? (userFound.imageUrl = await (0, s3bucket_util_1.getSignedUrl)(`image-${userFound._id.toString()}-profile`))
                : "";
            return {
                user: lodash_1.default.omit(userFound.toObject(), [
                    "createdAt",
                    "updatedAt",
                    "__v",
                    "password",
                ]),
                token: token,
            };
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
/**
 * confirm if user with the current email exists
 * @param user
 * @returns
 */
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
 * Get user with username from database
 * @param username
 * @returns
 */
async function getUser(username) {
    try {
        const user = await user_model_1.default.findOne({ name: username }).populate({
            path: "reviews",
            populate: { path: "reviewer" },
        })
            .exec();
        if (!user) {
            throw new Error('Could not retrieve user');
        }
        const userObj = user.toObject();
        if (userObj && userObj.imageUrl) {
            userObj.imageUrl = await (0, s3bucket_util_1.getSignedUrl)(`image-${userObj._id.toString()}-profile`);
        }
        // Iterate over 'reviews' array using a regular 'for' loop
        for (let i = 0; i < user.reviews.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const review = userObj.reviews[i];
            if (review.reviewer.imageUrl) {
                const imageUrl = await (0, s3bucket_util_1.getSignedUrl)(`image-${review.reviewer._id}-profile`);
                review.reviewer.imageUrl = imageUrl;
            }
        }
        return userObj;
    }
    catch (error) {
        throw error;
    }
}
exports.getUser = getUser;
/**
 * get trending producers from the database
 * @param page
 * @param limit
 * @returns producers and no of producers
 */
async function getProducers(page, limit, location) {
    try {
        let producers;
        if (location && location != "") {
            producers = await user_model_1.default.find({ type: "producer", location: location })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ total_plays: -1 })
                .exec();
        }
        else {
            producers = await user_model_1.default.find({ type: "producer" })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ total_plays: -1 })
                .exec();
        }
        const count = await user_model_1.default.countDocuments();
        producers.forEach(async (producer) => {
            producer.imageUrl === "" || producer.imageUrl === undefined
                ? (producer.imageUrl = "")
                : (producer.imageUrl = await (0, s3bucket_util_1.getSignedUrl)(`image-${producer._id.toString()}-profile`));
            producer.password = "";
            producer.__v = "";
        });
        return { producers, count };
    }
    catch (error) {
        throw error;
    }
}
exports.getProducers = getProducers;
/**
 * get producers from db and sort based on sold beats and mixes
 * @param page
 * @param limit
 * @returns engineers and count
 */
async function getEngineers(page, limit, location) {
    try {
        let engineers;
        if (location && location != "") {
            engineers = await user_model_1.default.find({ type: "engineer", location: location })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ beats_sold: -1 })
                .exec();
        }
        else {
            engineers = await user_model_1.default.find({ type: "engineer" })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ beats_sold: -1 })
                .exec();
        }
        const count = await user_model_1.default.countDocuments();
        engineers.forEach(async (engineer) => {
            engineer.imageUrl === "" || engineer.imageUrl === undefined
                ? (engineer.imageUrl = "")
                : (engineer.imageUrl = await (0, s3bucket_util_1.getSignedUrl)(`image-${engineer._id.toString()}-profile`));
            engineer.password = "";
            engineer.__v = "";
        });
        return { engineers, count };
    }
    catch (err) {
        throw err;
    }
}
exports.getEngineers = getEngineers;
/**
 * Save beat to user document in database
 * @param beat_id
 * @param user_id
 * @returns
 */
async function saveBeat(beat_id, user_id) {
    try {
        const user = await user_model_1.default.findById(user_id);
        user.saved_beats.push(beat_id);
        user.save();
        return { user: lodash_1.default.omit(user.toObject(), ["__v", "password"]) };
    }
    catch (error) {
        throw error;
    }
}
exports.saveBeat = saveBeat;
/**
 * Remove beat from list of saved beat in database
 * @param beat_id
 * @param user_id
 * @returns User object
 */
async function removeSavedBeat(beat_id, user_id) {
    try {
        const user = await user_model_1.default.findById(user_id);
        user.saved_beats.filter((beat) => {
            beat.toString() != beat_id;
        });
        user.save();
        return { user: lodash_1.default.omit(user.toObject(), ["__v", "password"]) };
    }
    catch (error) {
        throw error;
    }
}
exports.removeSavedBeat = removeSavedBeat;
/**
 * Get user by id
 * @param id User id
 * @returns user object
 */
async function getUserById(id) {
    try {
        return await user_model_1.default.findById(id);
    }
    catch (error) {
        throw error;
    }
}
exports.getUserById = getUserById;
