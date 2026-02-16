import express from 'express';
import { isAdminAuth, adminLogin, adminLogout } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

// Public Routes
adminRouter.post('/login', adminLogin);
adminRouter.get('/logout', adminLogout);

// Protected Route
adminRouter.get('/is-auth', authAdmin, isAdminAuth);

export default adminRouter;
