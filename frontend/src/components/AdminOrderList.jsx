import React, { useState, useEffect } from 'react';
import './AdminOrderList.css';

const AdminOrderList = ({ setCurrentPage, setSelectedOrderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        const response = await fetch('http://localhost:5000/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        
        setOrders(data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
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

      // Update the order status in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentPage('admin-order-details');
  };

  if (loading) {
    return (
      <div className="admin-order-list">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-order-list">
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() => setCurrentPage('admin-dashboard')}
            className="back-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-list">
      <div className="admin-order-header">
        <h2>Order Management</h2>
        <button
          onClick={() => setCurrentPage('admin-dashboard')}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}</td>
                <td>{order.user.name}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleViewDetails(order._id)}
                    className="view-button"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;