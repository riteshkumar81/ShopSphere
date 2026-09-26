import React from 'react';
import './Cart.css';

const Cart = ({ cartItems, onUpdateQuantity, onRemove, onBack, onCheckout }) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <button className="cart-back-button" onClick={onBack}>
          ← Continue Shopping
        </button>

        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products and they'll appear here.</p>

          <button className="continue-shopping" onClick={onBack}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <button className="cart-back-button" onClick={onBack}>
        ← Continue Shopping
      </button>

      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>{cartItems.length} product(s) in your cart</p>
      </div>

      <div className="cart-layout">

        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>

              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <p className="cart-item-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <p className="cart-item-price">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    onUpdateQuantity(item._id, item.quantity - 1)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    onUpdateQuantity(item._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="remove-item"
                onClick={() => onRemove(item._id)}
              >
                Remove
              </button>

            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-button"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;