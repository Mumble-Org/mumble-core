import multer, {FileFilterCallback} from 'multer';
import { Request } from 'express';



// Middleware to handle JSON data
// set up multer storage
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype !== "audio/mpeg" && file.mimetype !== "audio/wav") {
               cb(null, false);
               throw new Error('Unsupported File format');
        } else {
                cb(null, true);
        }
};

// Create a multer storage instance
const upload = multer({ storage: storage, fileFilter: fileFilter});

export default upload;