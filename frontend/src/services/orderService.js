import authService from './authService';

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

// Create order
const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data;
  } catch (error) {
    console.error('Order creation error:', error);
    throw error;
  }
};

// Get user's orders
const getMyOrders = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/my-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get single order by ID
const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById
};

export default orderService;