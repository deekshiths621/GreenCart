import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
    userName: { type: String, required: true }
}, { timestamps: true });

// Ensure one rating per user per product
ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Rating = mongoose.models.rating || mongoose.model('rating', ratingSchema);

export default Rating;
