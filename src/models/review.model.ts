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

// Create review model
const ReviewModel = mongoose.model<I_ReviewDocument>('Review', ReviewSchema);

// Export model
export default ReviewModel;