const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Create new order
router.post('/', protect, createOrder);

// Get logged in user's orders
router.get('/my-orders', protect, getMyOrders);

// Get single order by ID
router.get('/:id', protect, getOrderById);

module.exports = router;