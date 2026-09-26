// Import the Product model
const Product = require('../models/product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Return success response with products
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (for now, no authentication)
const createProduct = async (req, res) => {
  try {
    // Create a new product using the request body
    const product = await Product.create(req.body);

    // Return success response with the created product
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Handle validation errors and other errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle other errors
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message
    });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);

    // If product doesn't exist, return 404
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${productId}`
      });
    }

    // Return the product if found
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId errors
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: ${req.params.id}`
      });
    }

    // Handle other errors
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message
    });
  }
};

// @desc    Update a product by ID
// @route   PUT /api/products/:id
// @access  Public (for now, no authentication)
const updateProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.id;

    // Find the product by ID and update it with the request body
    // { new: true } returns the updated document
    // { runValidators: true } ensures the update respects schema validation
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // If product doesn't exist, return 404
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${productId}`
      });
    }

    // Return the updated product
    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId errors
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: ${req.params.id}`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle other errors
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message
    });
  }
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
// @access  Public (for now, no authentication)
const deleteProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.id;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // If product doesn't exist, return 404
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${productId}`
      });
    }

    // Return success message
    res.status(200).json({
      success: true,
      message: `Product with id ${productId} was deleted successfully`
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId errors
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: ${req.params.id}`
      });
    }

    // Handle other errors
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message
    });
  }
};

// Export the controller functions
module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};