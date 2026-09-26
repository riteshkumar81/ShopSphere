import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import './MyOrders.css';

const MyOrders = ({ setCurrentPage, setSelectedOrderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        if (response.success) {
          setOrders(response.data);
        } else {
          setError(response.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="back-button"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>You haven't placed any orders yet</h2>
        <p>When you place an order, it will appear here.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="shop-now-button"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.substring(0, 8)}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </div>
            </div>

            <div className="order-items">
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

            <div className="order-footer">
              <div className="total-amount">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
              <button
                onClick={() => {
                  setSelectedOrderId(order._id);
                  setCurrentPage('order-details');
                }}
                className="view-details-button"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;