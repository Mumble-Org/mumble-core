import { Router} from "express";
import auth from '../middlewares/auth'
import { uploadAudio, getAudio, deleteAudioFile } from '../controllers/audio.controller';
import upload from '../middlewares/upload.middleware';


/**
 * Initialize express router 
*/
const router: Router = Router()


/**
* Define audio routes
*/
router.post('/audio', auth, upload.single('audio'), uploadAudio);
router.get('/audio', auth, getAudio);
router.delete('/audio', auth, deleteAudioFile);

export default router;
