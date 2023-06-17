import mongoose from 'mongoose';
import { I_ReviewDocument } from '.';

// Define review Schema
const ReviewSchema = new mongoose.Schema<I_ReviewDocument>(
  {
    text: {
      type: String,
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
    },
  }, 
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);


// mongoose middleware to confirm if a user isn't reviewing his/her self
ReviewSchema.pre("save", async function (next) {
  const review = this;
  if (review.user_id == review.reviewer) {
    throw new Error('You can not review yourself');
  }
  next();
})

// Create review model
const ReviewModel = mongoose.model<I_ReviewDocument>('Review', ReviewSchema);

// Export model
export default ReviewModel;