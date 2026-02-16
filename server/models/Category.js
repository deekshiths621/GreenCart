import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    image: { type: String, default: '' }
}, { timestamps: true });

const Category = mongoose.models.category || mongoose.model('category', categorySchema);

export default Category;
