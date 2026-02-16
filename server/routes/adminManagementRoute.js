import express from 'express';
import {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getAllDeliveryPersons,
    addDeliveryPerson,
    updateDeliveryPerson,
    deleteDeliveryPerson,
    approveOrder,
    rejectOrder,
    updateOrderStatus,
    assignDeliveryPerson,
    getAdminOrders,
    getAllUsers,
    deleteUser,
    blockUser,
    getUserStats,
    getAdminProducts,
    deleteProductByAdmin,
    editProductByAdmin,
    getAllRatings,
    deleteRatingByAdmin,
    getDashboardStats
} from '../controllers/adminManagementController.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminManagementRouter = express.Router();

// All routes require admin authentication
adminManagementRouter.use(authAdmin);

// Category Routes
adminManagementRouter.get('/categories', getAllCategories);
adminManagementRouter.post('/category/add', addCategory);
adminManagementRouter.put('/category/update', updateCategory);
adminManagementRouter.delete('/category/delete', deleteCategory);

// Delivery Person Routes
adminManagementRouter.get('/delivery-persons', getAllDeliveryPersons);
adminManagementRouter.post('/delivery-person/add', addDeliveryPerson);
adminManagementRouter.put('/delivery-person/update', updateDeliveryPerson);
adminManagementRouter.delete('/delivery-person/delete', deleteDeliveryPerson);

// Order Management Routes
adminManagementRouter.get('/orders', getAdminOrders);
adminManagementRouter.put('/order/approve', approveOrder);
adminManagementRouter.put('/order/reject', rejectOrder);
adminManagementRouter.put('/order/update-status', updateOrderStatus);
adminManagementRouter.put('/order/assign-delivery', assignDeliveryPerson);

// User Management Routes
adminManagementRouter.get('/users', getAllUsers);
adminManagementRouter.delete('/user/delete', deleteUser);
adminManagementRouter.put('/user/block', blockUser);
adminManagementRouter.get('/user/stats/:userId', getUserStats);

// Product Management Routes
adminManagementRouter.get('/products', getAdminProducts);
adminManagementRouter.delete('/product/delete', deleteProductByAdmin);
adminManagementRouter.put('/product/edit', editProductByAdmin);

// Ratings Management Routes
adminManagementRouter.get('/ratings', getAllRatings);
adminManagementRouter.delete('/rating/delete', deleteRatingByAdmin);

// Dashboard Stats Route
adminManagementRouter.get('/stats', getDashboardStats);

export default adminManagementRouter;
