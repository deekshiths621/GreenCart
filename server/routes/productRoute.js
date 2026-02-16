import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, deleteProduct, editProduct, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

// Optional upload middleware - handles both file uploads and JSON
const optionalUpload = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        upload.array('images')(req, res, next);
    } else {
        next();
    }
};

productRouter.post('/add', authSeller, optionalUpload, addProduct);
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, changeStock)
productRouter.post('/delete', authSeller, deleteProduct)
productRouter.post('/edit', authSeller, editProduct)

export default productRouter;