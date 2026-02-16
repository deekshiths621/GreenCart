import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

// Protected Route (Requires authUser middleware)
// Make sure this is a .get request to match your AppContext.jsx
userRouter.get('/is-auth', authUser, isAuth); 

export default userRouter;