import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ user, setCurrentPage }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setCurrentPage('home');
    }
  }, [user, setCurrentPage]);

  // Fetch dashboard stats ONLY for admin users
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch dashboard statistics');
        }

        setStats(data.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch stats if user is an admin
    if (user && user.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]); // Only dependency is user to react to changes

  // Format currency for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="back-button"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Overview of your ShopSphere store</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card products">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>

        <div className="stat-card orders">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>

        <div className="stat-card users">
          <h3>Total Users</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>

        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>
      <div className="admin-actions">
        <button
          onClick={() => setCurrentPage('admin-product-list')}
          className="admin-nav-button"
        >
          Manage Products
        </button>
        <button
          onClick={() => setCurrentPage('admin-order-list')}
          className="admin-nav-button"
        >
          Manage Orders
        </button>
      </div>

      <button
        onClick={() => setCurrentPage('home')}
        className="back-button"
      >
        Back to Shop
      </button>
    </div>
  );
};

export default AdminDashboard;