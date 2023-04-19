import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { I_UserDocument } from ".";

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
				type: String,
			},
		],
		type: {
			type: String,
			enum: ["producer", "artist", "engineer"],
			default: "producer",
		},
		beats: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Beat'
		}],
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
