import Category from "../models/Category.js";
import DeliveryPerson from "../models/DeliveryPerson.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Rating from "../models/Rating.js";

// ========== CATEGORY MANAGEMENT ==========

// Get All Categories : /api/admin/categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Add Category : /api/admin/category/add
export const addCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.json({ success: false, message: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({ success: false, message: "Category already exists" });
        }

        await Category.create({ name, description, image });
        res.json({ success: true, message: "Category added successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update Category : /api/admin/category/update
export const updateCategory = async (req, res) => {
    try {
        const { id, name, description, image, isActive } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Category ID is required" });
        }

        await Category.findByIdAndUpdate(id, { name, description, image, isActive });
        res.json({ success: true, message: "Category updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete Category : /api/admin/category/delete
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Category ID is required" });
        }

        await Category.findByIdAndDelete(id);
        res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== DELIVERY PERSON MANAGEMENT ==========

// Get All Delivery Persons : /api/admin/delivery-persons
export const getAllDeliveryPersons = async (req, res) => {
    try {
        const deliveryPersons = await DeliveryPerson.find().sort({ createdAt: -1 });
        res.json({ success: true, deliveryPersons });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Add Delivery Person : /api/admin/delivery-person/add
export const addDeliveryPerson = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !email || !phone) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const existingPerson = await DeliveryPerson.findOne({ email });
        if (existingPerson) {
            return res.json({ success: false, message: "Delivery person with this email already exists" });
        }

        await DeliveryPerson.create({ name, email, phone, address });
        res.json({ success: true, message: "Delivery person added successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update Delivery Person : /api/admin/delivery-person/update
export const updateDeliveryPerson = async (req, res) => {
    try {
        const { id, name, email, phone, address, isActive } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Delivery person ID is required" });
        }

        await DeliveryPerson.findByIdAndUpdate(id, { name, email, phone, address, isActive });
        res.json({ success: true, message: "Delivery person updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete Delivery Person : /api/admin/delivery-person/delete
export const deleteDeliveryPerson = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Delivery person ID is required" });
        }

        await DeliveryPerson.findByIdAndDelete(id);
        res.json({ success: true, message: "Delivery person deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== ORDER MANAGEMENT ==========

// Approve Order : /api/admin/order/approve
export const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        await Order.findByIdAndUpdate(orderId, { 
            isApproved: true, 
            isRejected: false,
            status: "Approved" 
        });

        res.json({ success: true, message: "Order approved successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Reject Order : /api/admin/order/reject
export const rejectOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        await Order.findByIdAndUpdate(orderId, { 
            isRejected: true, 
            isApproved: false,
            status: "Rejected",
            rejectionReason: reason || "Order rejected by admin"
        });

        res.json({ success: true, message: "Order rejected successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status : /api/admin/order/update-status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Assign Delivery Person : /api/admin/order/assign-delivery
export const assignDeliveryPerson = async (req, res) => {
    try {
        const { orderId, deliveryPersonId } = req.body;

        if (!orderId || !deliveryPersonId) {
            return res.json({ success: false, message: "Order ID and Delivery Person ID are required" });
        }

        // Update order with delivery person
        await Order.findByIdAndUpdate(orderId, { deliveryPerson: deliveryPersonId });

        // Add order to delivery person's assigned orders
        await DeliveryPerson.findByIdAndUpdate(deliveryPersonId, {
            $addToSet: { assignedOrders: orderId }
        });

        res.json({ success: true, message: "Delivery person assigned successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders (Admin) : /api/admin/orders
export const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.product')
            .populate('address')
            .populate('deliveryPerson')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== USER MANAGEMENT ==========

// Get All Users : /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete User : /api/admin/user/delete
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Block/Unblock User : /api/admin/user/block
export const blockUser = async (req, res) => {
    try {
        const { userId, isBlocked } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        await User.findByIdAndUpdate(userId, { isBlocked });
        res.json({ success: true, message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get User Statistics : /api/admin/user/stats/:userId
export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all orders for this user
        const orders = await Order.find({ userId })
            .populate('items.product')
            .populate('address')
            .sort({ createdAt: -1 });

        // Calculate total purchase cost
        const totalPurchaseCost = orders.reduce((sum, order) => sum + order.amount, 0);

        res.json({ 
            success: true, 
            stats: {
                totalOrders: orders.length,
                totalPurchaseCost,
                orders
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== PRODUCT MANAGEMENT ==========

// Get All Products (Admin) : /api/admin/products
export const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete Product (Admin) : /api/admin/product/delete
export const deleteProductByAdmin = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        await Product.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Edit Product (Admin) : /api/admin/product/edit
export const editProductByAdmin = async (req, res) => {
    try {
        const { productId, name, category, price, offerPrice, description, bestSeller, available, image } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const updateData = {
            name,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice || 0),
            description,
            bestSeller,
            available
        };

        // Handle image - accept array or string, convert to array if needed
        if (image) {
            updateData.image = Array.isArray(image) ? image : [image];
        }

        await Product.findByIdAndUpdate(productId, updateData);

        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== RATINGS MANAGEMENT ==========

// Get All Ratings : /api/admin/ratings
export const getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find()
            .populate('productId', 'name')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, ratings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete Rating : /api/admin/rating/delete
export const deleteRatingByAdmin = async (req, res) => {
    try {
        const { ratingId } = req.body;

        if (!ratingId) {
            return res.json({ success: false, message: "Rating ID is required" });
        }

        const rating = await Rating.findByIdAndDelete(ratingId);

        if (!rating) {
            return res.json({ success: false, message: "Rating not found" });
        }

        // Recalculate product rating
        const ratings = await Rating.find({ productId: rating.productId });
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            : 0;

        await Product.findByIdAndUpdate(rating.productId, {
            averageRating: averageRating.toFixed(1),
            totalRatings
        });

        res.json({ success: true, message: "Rating deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== DASHBOARD STATS ==========

// Get Dashboard Stats : /api/admin/stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalDeliveryPersons = await DeliveryPerson.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({ isPaid: true });
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                totalDeliveryPersons
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
