import AWS from "aws-sdk";
import { Request } from 'express';

const region = process.env.REGION;
const bucket = process.env.BUCKET || "mumbleaudios";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

/**
* Set up AWS S3 Client
 */

export const s3Client = new AWS.S3({
        region, 
        accessKeyId,
        secretAccessKey
})

/**
 * get audio from s3 bucket
 * @param audioUrl 
 * @returns promise
 */
export const downloadAudio = (audioUrl: string) => {
        const params = {
                Key: audioUrl,
                Bucket: bucket
        };

        return s3Client.getObject(params, (err) => {
                console.log(err);
        }).promise();
}

/**
 * upload audio to s3 bucket
 * @param req 
 * @returns promise
 */
export const upload = (id: string, filename: string | undefined, req: Request) => {
        if (filename!= undefined && id) {
                const params = {
                        Bucket: bucket,
                        Key: `audio-${id}-${filename}`,
                        Body: req.file?.buffer
                };

                return s3Client.upload(params).promise();
        }
}

/**
 * delete audio from s3 bucket
 * @param audioUrl 
 * @returns 
 */
export const deleteAudio = (audio: string) => {
        const params = {
                Bucket: bucket,
                Key: audio
        };

        return s3Client.deleteObject(params).promise();
}