import { Request, Response} from 'express';
import { getErrorMessage } from '../utils/errors.util';
import { upload, deleteAudio, getSignedUrl } from '../utils/s3bucket.util';
import AudioModel from '../models/audio.model';
import _ from 'lodash'


/**
 * Define upload route's controller
 * @param req 
 * @param res 
 */
export const uploadAudio = async (req: Request, res: Response) => {
        try {
                // Save audio file to s3
                const filename = req.file?.originalname;
                const s3Object = await upload(req.body.id, filename, req);

                const audio = new AudioModel({
                        name: req.file?.originalname,
                        audioUrl: s3Object?.Location,
                        user_id: req.body.id,
                        imageUrl: req.body.imageUrl
                });

                const savedAudio = await audio.save();
                const audioR = _.omit(savedAudio.toObject(),["__v", "created_at", "updated_at"]);

                res.status(201).json({audioR});
        } catch (err) {
                res.status(500).send('Internal Server Error');
                console.log(getErrorMessage(err));
        }
}

/**
 * get audio file
 * @param req 
 * @param res 
 * @returns 
 */
export const getAudio = async (req: Request, res: Response) => {
        try {
                // Retrieve audio file URL from mongoDB by id
                const audio = await AudioModel.findById(req.body.id);
                if (!audio) {
                        return res.status(404).send('Audio not found');
                }

                // get audio from s3 bucket
                const audioKey = `audio-${audio.user_id}-${audio.name}`;

                const signedUrl = getSignedUrl(audioKey);


                const audioR = _.omit(audio.toObject(), ["__v"]);

                // Return audio file URL on s3
                res.status(200).json({ audioR, signedUrl });
        } catch (err) {
                console.log(getErrorMessage(err));
                res.status(500).send('Internal Server Error');
        }
}


/**
 * Delete audio from s3 bucket and database
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteAudioFile = async (req: Request, res: Response) => {
        try {
                // find audio and delete from database
                const audio = await AudioModel.findOneAndDelete({audioUrl: req.body.audioUrl})

                if (!audio) {
                        return res.status(404).send('Audio not found');
                }

                // delete audio from s3 bucket
                const audioKey = `audio-${audio.user_id}-${audio.name}`;

                const deleted = await deleteAudio(audioKey);
                if (deleted) {
                        res.status(200).send('audio deleted!');
                }
        } catch (err) {
                console.log(getErrorMessage(err));
                res.status(500).send('Internal Server Error');
        }
}