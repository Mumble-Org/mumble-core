import multer, {FileFilterCallback} from 'multer';
import { Request } from 'express';



/**
 * Middleware to handle JSON file data
 * set up multer storage
 */
const storage = multer.memoryStorage();

/**
 * check file type and filter invalid files out
 * @param req 
 * @param file 
 * @param cb 
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.fieldname === "audio") {
            if (file.mimetype !== "audio/mpeg" && file.mimetype !== "audio/wav") {
                cb(null, false);
                throw new Error('Unsupported File format');
            } else {
                    cb(null, true);
            }
        } else if (file.fieldname === "image") {
            if (
                file.mimetype !== "image/jpg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/gif"
                ) {
                    // check if file type is an image or gif
                    cb(null, false);
                    throw new Error('Unsupported File format');
                } else {
                    cb(null, true);
                }
        }
};

// Create a multer storage instance
const upload = multer({ storage: storage, fileFilter: fileFilter});

export default upload;