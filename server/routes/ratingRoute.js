import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addRating, getProductRatings, getUserRating, deleteRating } from '../controllers/ratingController.js';

const ratingRouter = express.Router();

// Add or update rating (protected route)
ratingRouter.post('/add', authUser, addRating);

// Get all ratings for a product (public)
ratingRouter.get('/product/:productId', getProductRatings);

// Get user's rating for a product (public)
ratingRouter.get('/user/:productId/:userId', getUserRating);

// Delete rating (protected route)
ratingRouter.post('/delete', authUser, deleteRating);

export default ratingRouter;
