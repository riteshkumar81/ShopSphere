const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/adminOrderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', protect, admin, getAllOrders);

// @route   GET /api/admin/orders/:id
// @desc    Get single order by ID
// @access  Private/Admin
router.get('/orders/:id', protect, admin, getOrderById);

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

module.exports = router;