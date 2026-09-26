import React, { useState } from 'react';
import orderService from '../services/orderService';
import './Checkout.css';

const Checkout = ({ cartItems, clearCart, setOrderSuccess }) => {
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { address, city, postalCode, country } = shippingAddress;

  const onChange = (e) => {
    setShippingAddress((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ).toFixed(2);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping address fields');
      setIsLoading(false);
      return;
    }

    // Prepare order data
  const orderData = {
  orderItems: cartItems.map(item => ({
    product: item._id,
    quantity: item.quantity,
    image: item.image
  })),
  shippingAddress
};

    try {
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Clear cart
        clearCart();

        // Set order success state
        setOrderSuccess({
          orderId: response.data._id,
          totalAmount: response.data.totalAmount
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        <div className="shipping-form">
          <h3>Shipping Address</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={postalCode}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={country}
                onChange={onChange}
                required
              />
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item._id} className="order-item">
                    <div className="item-info">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div>
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <h4>Total: ${calculateTotal()}</h4>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;