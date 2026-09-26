// Import required modules
const express = require('express');
const router = express.Router();

// Import the product controller functions
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', getProducts);

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
router.post('/', createProduct);

router.get('/:id', getProductById);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;