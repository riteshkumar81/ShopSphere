import React, { useState, useEffect } from 'react';

const AdminProductForm = ({ productId, setCurrentPage }) => {
  const [product, setProduct] = useState({
    name: '',
    brand: '', // Added brand field
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    image: '',
    images: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch product if in edit mode
  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${productId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch product');
          }

          setProduct({
            name: data.data.name,
            brand: data.data.brand || '', // Load existing brand
            description: data.data.description,
            price: data.data.price,
            discountPrice: data.data.discountPrice || '',
            category: data.data.category,
            stock: data.data.stock,
            image: data.data.image,
            images: data.data.images ? data.data.images.join(', ') : ''
          });
        } catch (err) {
          setError(err.message);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `http://localhost:5000/api/admin/products/${productId}`
        : 'http://localhost:5000/api/admin/products';

      const method = isEditMode ? 'PUT' : 'POST';

      // Parse images string into array
      const parsedImages = product.images
        ? product.images.split(',').map(img => img.trim()).filter(img => img)
        : [];

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: product.name,
          brand: product.brand, // Include brand in request
          description: product.description,
          price: parseFloat(product.price),
          discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : null,
          category: product.category,
          stock: parseInt(product.stock),
          image: product.image,
          images: parsedImages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors if they exist
        if (data.errors && Array.isArray(data.errors)) {
          throw {
            message: data.message || 'Validation failed',
            errors: data.errors
          };
        }
        throw new Error(data.message || 'Failed to save product');
      }

      setSuccess(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      setTimeout(() => {
        setCurrentPage('admin-product-list');
      }, 1500);
    } catch (err) {
      // Display validation errors if they exist
      if (err.errors) {
        setError(
          <div>
            <p>{err.message}</p>
            <ul className="error-list">
              {err.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <div className="form-header">
        <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
        <button
          onClick={() => setCurrentPage('admin-product-list')}
          className="back-button"
        >
          Back to Products
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discountPrice">Discount Price (optional)</label>
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              value={product.discountPrice}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Primary Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Additional Image URLs (comma separated)</label>
          <input
            type="text"
            id="images"
            name="images"
            value={product.images}
            onChange={handleChange}
            placeholder="Enter multiple image URLs separated by commas"
          />
          <small>Enter multiple image URLs separated by commas</small>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;