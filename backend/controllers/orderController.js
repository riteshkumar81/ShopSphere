const Order = require('../models/order');
const Product = require('../models/product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Get product details from database (don't trust frontend prices)
    const products = await Product.find({
      _id: { $in: orderItems.map(item => item.product) }
    });

    // TEMPORARY DEBUGGING LOGS
    console.log('DEBUG: Products from MongoDB:', JSON.stringify(products, null, 2));
    if (products.length > 0) {
      console.log('DEBUG: First product image:', products[0].image);
    }

    // Calculate total amount based on current database prices
    let totalAmount = 0;
    const orderItemsWithDetails = [];

    for (const item of orderItems) {
      const product = products.find(p => p._id.toString() === item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }

      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;

      orderItemsWithDetails.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: price
      });
    }

    // TEMPORARY DEBUGGING LOG
    console.log('DEBUG: orderItemsWithDetails:', JSON.stringify(orderItemsWithDetails, null, 2));

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: orderItemsWithDetails,
      shippingAddress,
      totalAmount
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Check if the order belongs to the logged in user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId errors
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: `Invalid order ID format: ${req.params.id}`
      });
    }

    console.error('Error fetching order by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};