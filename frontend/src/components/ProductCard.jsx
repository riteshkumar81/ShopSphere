import React from 'react';

const ProductCard = ({ product, onViewProduct, onAddToCart }) => {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const effectivePrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      onAddToCart(product);
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => onViewProduct(product._id)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <div className="price-info">
          {hasDiscount && (
            <span className="original-price">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="effective-price">
            ${effectivePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="discount-percentage">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        <p className="stock-status">
          {product.stock === 0 ? 'Out of Stock' : `In Stock: ${product.stock}`}
        </p>
        <button
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;