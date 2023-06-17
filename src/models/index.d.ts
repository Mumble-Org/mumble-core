import { Types } from "mongoose";

/**
 * User model interface
 */
export interface I_UserDocument {
	name: string;
	password: string;
	calendar?: string;
	email: string;
	genres?: Array<string>;
	location?: string;
	phone_number?: string;
	portfolio?: Array<string>;
	type: string;
	beats: Array<Types.ObjectId>;
	beats_sold: number;
	beats_uploaded: number;
	songs_mixed: number;
	rate: number;
	total_plays: number;
	saved_beats: Array<string>;
	imageUrl: string;
	reviews: Array<Types.ObjectId>;
}

/**
 * Audio model interface
 */
export interface I_BeatDocument {
	name: string;
	user_id: Types.ObjectId;
	beatUrl: string;
	imageUrl: string;
	dataUrl: string;
	genre: string;
	price: number;
	license: string;
	key: string;
	plays: number;
}


export interface I_ReviewDocument {
	text: string;
	reviewer: Types.ObjectId;
	user_id: Types.ObjectId;
	rating: number;
}