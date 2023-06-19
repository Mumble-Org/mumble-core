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
exports.getReview = exports.createReview = void 0;
const reviewServices = __importStar(require("../services/review.services"));
/**
 * createReview - Create a new review
 * @param req
 * @param res
 */
const createReview = async (req, res) => {
    try {
        const { reviewText, rating, reviewerId, userId } = req.body;
        const review = await reviewServices.create({ reviewText, rating, reviewerId, userId });
        res.status(201).json(review);
    }
    catch (error) {
        if (error instanceof Error && error.message == "You cannot review yourself!") {
            return res.status(401).send(error.message);
        }
        res.status(500).send("Internal Server Error");
        console.log(error);
    }
};
exports.createReview = createReview;
/**
 * getReview - get review
 * @param req
 * @param res
 * @returns
 */
const getReview = async (req, res) => {
    try {
        // Retrieve review id
        const { id } = req.body;
        const review = await reviewServices.get(id);
        return res.status(200).json(review);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        console.log(error);
    }
};
exports.getReview = getReview;
