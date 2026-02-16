import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let imagesUrl = [];

        // Check if image URLs are provided directly
        if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
            // Use provided image URLs directly
            imagesUrl = req.body.imageUrls;
            const productData = {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                offerPrice: req.body.offerPrice
            };
            await Product.create({...productData, image: imagesUrl});
        } else {
            // Handle file uploads (original functionality)
            let productData = JSON.parse(req.body.productData);
            const images = req.files;

            if (!images || images.length === 0) {
                return res.json({success: false, message: "Please provide at least one image"});
            }

            imagesUrl = await Promise.all(
                images.map(async (item)=>{
                    let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                    return result.secure_url
                })
            );

            await Product.create({...productData, image: imagesUrl});
        }

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const productList = async (req, res)=>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Delete Product : /api/product/delete
export const deleteProduct = async (req, res)=>{
    try {
        const { id } = req.body
        await Product.findByIdAndDelete(id)
        res.json({success: true, message: "Product Deleted Successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Edit Product : /api/product/edit
export const editProduct = async (req, res)=>{
    try {
        const { id, name, category, price, offerPrice, description, bestSeller } = req.body
        
        await Product.findByIdAndUpdate(id, {
            name,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            description,
            bestSeller
        })
        
        res.json({success: true, message: "Product Updated Successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
