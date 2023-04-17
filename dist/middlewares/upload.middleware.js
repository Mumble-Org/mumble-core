"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
/**
 * Middleware to handle JSON file data
 * set up multer storage
 */
const storage = multer_1.default.memoryStorage();
/**
 * check file type and filter invalid files out
 * @param req
 * @param file
 * @param cb
 */
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "audio") {
        if (file.mimetype !== "audio/mpeg" && file.mimetype !== "audio/wav") {
            cb(null, false);
            throw new Error('Unsupported File format');
        }
        else {
            cb(null, true);
        }
    }
    else if (file.fieldname === "image") {
        if (file.mimetype !== "image/jpg" &&
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/jpeg" &&
            file.mimetype !== "image/gif") {
            // check if file type is an image or gif
            cb(null, false);
            throw new Error('Unsupported File format');
        }
        else {
            cb(null, true);
        }
    }
};
// Create a multer storage instance
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
exports.default = upload;
