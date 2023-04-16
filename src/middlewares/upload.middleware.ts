import multer, {FileFilterCallback} from 'multer';
import { Request } from 'express';



/**
 * Middleware to handle JSON file data
 * set up multer storage
 */
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                if (file.fieldname === "audio") {
                        cb(null, './uploads/audio');
                } else if (file.fieldname === "image") {
                        cb(null, './uploads/image');
                }
        }
});

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
const upload = multer({ storage: storage, fileFilter: fileFilter}).fields([
    {
        name: 'audio',
        maxCount: 1

    }, {
        name: 'image',
        maxCount: 1
    }]
);

export default upload;