import {Types } from 'mongoose';

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
}


/**
* Audio model interface
 */
export interface I_BeatDocument {
	name: string;
	user_id: Types.ObjectId;
	audioUrl: string;
	imageUrl: string;
}