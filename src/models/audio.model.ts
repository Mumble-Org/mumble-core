import { I_BeatDocument } from ".";
import mongoose from 'mongoose';


// Audio schema
const beatSchema = new mongoose.Schema<I_BeatDocument>({
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
const BeatModel = mongoose.model<I_BeatDocument>('Audio', beatSchema);

// export model
export default BeatModel;