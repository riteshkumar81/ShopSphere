const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Create product (admin-only)
router.post('/', protect, admin, createProduct);

// Update product (admin-only)
router.put('/:id', protect, admin, updateProduct);

// Delete product (admin-only)
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;