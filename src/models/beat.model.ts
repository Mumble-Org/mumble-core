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
	},
	{ timestamps: true }
);

// create beat model
const BeatModel = mongoose.model<I_BeatDocument>("Beat", beatSchema);

// export model
export default BeatModel;
