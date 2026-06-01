const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { imageUpload } = require('../utils/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  uploadProductImage,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.post('/upload-image', auth, requireRole('admin'), imageUpload.single('image'), uploadProductImage);
router.get('/:id', getProductById);
router.post('/', auth, requireRole('admin'), createProduct);
router.put('/:id', auth, requireRole('admin'), updateProduct);
router.delete('/:id', auth, requireRole('admin'), deleteProduct);
router.post('/:id/reviews', auth, createReview);

module.exports = router;
