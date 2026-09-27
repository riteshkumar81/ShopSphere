import React, { useState, useEffect } from 'react';
import './AdminProductList.css';

const AdminProductList = ({ setCurrentPage, setSelectedProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
    }

    setProducts(data.data);
} catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
     const response = await fetch(
  `${import.meta.env.VITE_API_URL}/admin/products/${productId}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      // Remove the deleted product from the list
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-product-list">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-product-list">
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
    <div className="admin-product-list">
      <div className="admin-product-header">
        <h2>Product Management</h2>
        <div className="admin-actions">
          <button
            onClick={() => setCurrentPage('admin-dashboard')}
            className="back-button"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              setSelectedProductId(null);
              setCurrentPage('admin-product-form');
            }}
            className="add-product-button"
          >
            Add Product
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="error-message">
          <p>{deleteError}</p>
        </div>
      )}

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumbnail"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => {
                      setSelectedProductId(product._id);
                      setCurrentPage('admin-product-form');
                    }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="delete-button"
                  >
                    Delete
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

export default AdminProductList;