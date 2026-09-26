import React, { useState, useEffect } from 'react';
import './AdminOrderDetails.css';

const AdminOrderDetails = ({ orderId, setCurrentPage }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order');
        }
        
        setOrder(data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      // Update the order in the local state
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-order-details">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-order-details">
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() => setCurrentPage('admin-order-list')}
            className="back-button"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-details">
        <div className="error-message">
          <p>Order not found</p>
          <button
            onClick={() => setCurrentPage('admin-order-list')}
            className="back-button"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-details">
      <div className="order-header">
        <h2>Order Details</h2>
        <button
          onClick={() => setCurrentPage('admin-order-list')}
          className="back-button"
        >
          Back to Orders
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

        <div className="customer-info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {order.user.name}</p>
          <p><strong>Email:</strong> {order.user.email}</p>
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
              <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-total">
        <h3>Order Total</h3>
        <p className="total-amount">${order.totalAmount.toFixed(2)}</p>
      </div>

      <div className="status-update">
        <h3>Update Order Status</h3>
        <select
          value={order.status}
          onChange={(e) => handleUpdateStatus(e.target.value)}
          disabled={updating}
          className="status-select"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {updating && <span className="updating-indicator">Updating...</span>}
      </div>
    </div>
  );
};

export default AdminOrderDetails;