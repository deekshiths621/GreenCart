import Rating from "../models/Rating.js";
import Product from "../models/Product.js";

// Add or Update Rating : /api/rating/add
export const addRating = async (req, res) => {
    try {
        const { productId, userId, rating, review, userName } = req.body;

        if (!productId || !userId || !rating) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        // Check if user already rated this product
        let existingRating = await Rating.findOne({ productId, userId });

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.review = review || '';
            await existingRating.save();
        } else {
            // Create new rating
            await Rating.create({ productId, userId, rating, review, userName });
        }

        // Recalculate average rating for the product
        const ratings = await Rating.find({ productId });
        const totalRatings = ratings.length;
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

        // Update product with new average rating
        await Product.findByIdAndUpdate(productId, {
            averageRating: averageRating.toFixed(1),
            totalRatings
        });

        res.json({ 
            success: true, 
            message: existingRating ? "Rating updated successfully" : "Rating added successfully",
            averageRating: averageRating.toFixed(1),
            totalRatings
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Product Ratings : /api/rating/product/:productId
export const getProductRatings = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const ratings = await Rating.find({ productId })
            .sort({ createdAt: -1 })
            .select('rating review userName createdAt userId');

        res.json({ success: true, ratings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get User Rating for Product : /api/rating/user/:productId/:userId
export const getUserRating = async (req, res) => {
    try {
        const { productId, userId } = req.params;

        if (!productId || !userId) {
            return res.json({ success: false, message: "Product ID and User ID are required" });
        }

        const rating = await Rating.findOne({ productId, userId });

        if (!rating) {
            return res.json({ success: true, rating: null });
        }

        res.json({ success: true, rating });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete Rating : /api/rating/delete
export const deleteRating = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        if (!productId || !userId) {
            return res.json({ success: false, message: "Product ID and User ID are required" });
        }

        const rating = await Rating.findOneAndDelete({ productId, userId });

        if (!rating) {
            return res.json({ success: false, message: "Rating not found" });
        }

        // Recalculate average rating for the product
        const ratings = await Rating.find({ productId });
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
            : 0;

        // Update product with new average rating
        await Product.findByIdAndUpdate(productId, {
            averageRating: averageRating.toFixed(1),
            totalRatings
        });

        res.json({ success: true, message: "Rating deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
