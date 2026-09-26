import React, { useEffect, useState } from 'react';
import productService from '../services/productService';
import './ProductDetails.css';

const ProductDetails = ({ productId, onBack, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(productId);

        if (response.success) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="product-details-status">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-status">
        <p>{error || 'Product not found'}</p>

        <button onClick={onBack}>
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      <button
        className="product-back-button"
        onClick={onBack}
      >
        ← Back to Products
      </button>

      <div className="product-details-card">

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-brand">
            Brand: {product.brand}
          </p>

          <div className="product-details-price">
            ${Number(product.price).toFixed(2)}
          </div>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-details-stock">
            {product.stock > 0
              ? `In Stock: ${product.stock}`
              : 'Out of Stock'}
          </div>

          <button
            className="product-add-button"
            disabled={product.stock === 0}
            onClick={() => onAddToCart(product)}
          >
            {product.stock > 0
              ? 'Add to Cart'
              : 'Out of Stock'}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;