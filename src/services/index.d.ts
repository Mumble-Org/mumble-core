export interface Beat {
	_id: string,
	name: string,
	user_id: string,
	beatUrl: string,
	imageUrl: string,
	createdAt: string,
	updatedAt: string,
	__v?: number,
	key: string,
}

export interface Review {
	reviewText: string,
	reviewerId: string,
	userId: string,
	rating: number,
}