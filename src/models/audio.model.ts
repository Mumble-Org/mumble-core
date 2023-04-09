import { I_AudioDocument } from ".";
import mongoose from 'mongoose';


// Audio schema
const audioSchema = new mongoose.Schema<I_AudioDocument>({
        name: {
                type: String,
                required: true
        },
        user_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
        },
        audioUrl: {
                type: String,
                required: true
        },
        imageUrl: {
                type: String,
                required: true
        }
}, {timestamps: true});

// create audio model
const AudioModel = mongoose.model<I_AudioDocument>('Audio',audioSchema);

// export model
export default AudioModel;