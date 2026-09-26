const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/User');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard-stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    // Calculate statistics in parallel
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenueResult
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    // Extract revenue from aggregation result
    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

module.exports = {
  getDashboardStats
};