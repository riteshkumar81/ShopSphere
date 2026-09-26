const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard-stats', protect, admin, getDashboardStats);

module.exports = router;