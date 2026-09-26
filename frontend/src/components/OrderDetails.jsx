import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import './OrderDetails.css';

const OrderDetails = ({ orderId, setCurrentPage }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.message || 'Failed to fetch order details');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button
          onClick={() => setCurrentPage('my-orders')}
          className="back-button"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <p>Order not found</p>
        <button
          onClick={() => setCurrentPage('my-orders')}
          className="back-button"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h2>Order Details</h2>
        <button
          onClick={() => setCurrentPage('my-orders')}
          className="back-button"
        >
          Back to My Orders
        </button>
      </div>

      <div className="order-info">
        <div className="order-summary">
          <div className="order-id">
            <strong>Order ID:</strong> {order._id}
          </div>
          <div className="order-date">
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className={`order-status ${order.status.toLowerCase()}`}>
            <strong>Status:</strong> {order.status}
          </div>
        </div>

        <div className="shipping-address">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      <div className="order-items">
        <h3>Order Items</h3>
        {order.orderItems.map(item => (
          <div key={item._id} className="order-item">
            <img
              src={item.image}
              alt={item.name}
              className="item-image"
            />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity}</p>
              <p className="item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-total">
        <h3>Order Total</h3>
        <p className="total-amount">
          ${order.totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;