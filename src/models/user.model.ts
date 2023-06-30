import { I_UserDocument } from ".";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

/**
 * User model schema
 */
const UserSchema = new mongoose.Schema<I_UserDocument>(
	{
		name: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			min: 5,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		imageUrl: {
			type: String,
		},
		calendar: {
			type: String,
		},
		genres: [
			{
				type: String,
			},
		],
		location: {
			type: String,
		},
		phone_number: {
			type: String,
		},
		portfolio: [
			{
				title: {
					type: String,
				},
				link: {
					type: String,
				},
			},
		],
		type: {
			type: String,
			enum: ["producer", "artist", "engineer"],
			default: "producer",
		},
		beats: [
			{
				type: String,
			},
		],
		beats_uploaded: {
			type: Number,
			default: 0,
			required: true,
		},
		beats_sold: {
			type: Number,
			default: 0,
			required: true,
		},
		songs_mixed: {
			type: Number,
			default: 0,
			required: true,
		},
		rate: {
			type: Number,
			default: 0,
		},
		total_plays: {
			type: Number,
			default: 0,
		},
		saved_beats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Beat",
			},
		],
		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		rating: {
			type: Number,
			default: 0,
			required: true,
		}
	},
	{ timestamps: true }
);

// bcrypt salt rounds
const saltRounds = 8;

// mongoose middleware to alter password before saving
UserSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, saltRounds);
	}
	next();
});

// create user model
const UserModel = mongoose.model<I_UserDocument>("User", UserSchema);

// export userModels
export default UserModel;
