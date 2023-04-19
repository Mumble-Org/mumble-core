import { I_BeatDocument } from ".";
import mongoose from "mongoose";

/**
 * Beat schema
 */
const beatSchema = new mongoose.Schema<I_BeatDocument>(
	{
		name: {
			type: String,
			required: true,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		beatUrl: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		dataUrl: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		license: {
			type: String,
			enum: ['exclusive', 'basic', 'non-exclusive'],
			default: 'exclusive',
			required: true,
		},
		key: {
			type: String,
			required: true,
		},
		plays: {
			type: Number,
			default: 0,
			required: true,
		}
	},
	{ timestamps: true }
);

// create beat model
const BeatModel = mongoose.model<I_BeatDocument>("Beat", beatSchema);

// export model
export default BeatModel;
