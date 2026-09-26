import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import authService from './services/authService';
import productService from './services/productService';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout.jsx';
import MyOrders from './components/MyOrders';
import OrderDetails from './components/OrderDetails';
import AdminDashboard from './components/AdminDashboard';
import AdminProductList from './components/AdminProductList';
import AdminProductForm from './components/AdminProductForm';
import AdminOrderList from './components/AdminOrderList';
import AdminOrderDetails from './components/AdminOrderDetails';
// Dummy product data
const dummyProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    name: "Leather Wallet",
    category: "Accessories",
    price: 49.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    name: "Coffee Mug",
    category: "Home",
    price: 12.99,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 79.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

// Product Card Component
const ProductCard = ({
  product,
  onViewProduct,
  onAddToCart
}) => {
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

        <div className="price-rating">
          <span className="price">
            ${product.price.toFixed(2)}
          </span>

         <span className="rating">
  📦 Stock: {product.stock}
</span>
        </div>

       <button
  className="add-to-cart"
  onClick={(e) => {
    e.stopPropagation();
    onAddToCart(product);
  }}
>
  Add to Cart
</button>
      </div>
    </div>
  );
};

// Navigation Bar Component
const Navbar = ({ cartCount, user, onNavigate, onLogout, currentPage }) => {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => onNavigate('home')}>
        ShopSphere
      </div>

      <ul className="nav-links">
        <li>
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={currentPage === 'products' ? 'active' : ''}
            onClick={() => onNavigate('products')}
          >
            Products
          </button>
        </li>
        <li>
          <button
            className={currentPage === 'categories' ? 'active' : ''}
            onClick={() => onNavigate('categories')}
          >
            Categories
          </button>
        </li>
        {user && (
          <li>
            <button
              className={currentPage === 'my-orders' ? 'active' : ''}
              onClick={() => onNavigate('my-orders')}
            >
              My Orders
            </button>
          </li>
        )}
        {user && user.role === 'admin' && (
  <li>
    <button
      className={currentPage === 'admin-dashboard' ? 'active' : ''}
      onClick={() => onNavigate('admin-dashboard')}
    >
      Admin Dashboard
    </button>
  </li>
)}
      </ul>

      <div className="nav-actions">
        <button
          className="cart-button"
          onClick={() => onNavigate('cart')}
        >
          🛒 <span className="cart-count">{cartCount}</span>
        </button>

        {user ? (
          <div className="welcome-user">
            <span>Hello, {user.name.split(' ')[0]}</span>
            <button
              className="auth-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              className="auth-button"
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button
              className="auth-button"
              onClick={() => onNavigate('register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
// Hero Section
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">

        <h1>Discover Amazing Products</h1>

        <p>
          Find the best deals on electronics,
          fashion, and more at ShopSphere
        </p>

        <button className="shop-now">
          Shop Now
        </button>

      </div>
    </section>
  );
};

// Categories Section
const CategoriesSection = () => {

  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Clothing", icon: "👕" },
    { name: "Home", icon: "🏠" },
    { name: "Accessories", icon: "👓" }
  ];

  return (
    <section className="categories-section">

      <h2>Shop by Category</h2>

      <div className="categories-grid">

        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
          >
            <span className="category-icon">
              {category.icon}
            </span>

            <h3>{category.name}</h3>
          </div>
        ))}

      </div>

    </section>
  );
};

// Featured Products
const FeaturedProducts = ({
  onViewProduct,
  onAddToCart
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();

        if (response.success) {
          setProducts(response.data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError(err.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>

      {loading && (
        <p>Loading products...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p>No products available.</p>
      )}

      <div className="products-grid">
        {products.map(product => (
          <ProductCard
  key={product._id}
  product={product}
  onViewProduct={onViewProduct}
  onAddToCart={onAddToCart}
/>
        ))}
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-logo">
          ShopSphere
        </div>

        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>

        <div className="footer-social">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2023 ShopSphere. All rights reserved.
        </p>
      </div>

    </footer>
  );
};

// Main App
function App() {
  // =========================
  // STATE
  // =========================

  const [currentPage, setCurrentPage] = useState('home');

  const [user, setUser] = useState(
    authService.getCurrentUser()
  );

  const [selectedProductId, setSelectedProductId] = useState(null);

  // Load cart from localStorage when app starts
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('shopsphere_cart');

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);


  // =========================
  // SAVE CART TO LOCALSTORAGE
  // =========================

  React.useEffect(() => {
    localStorage.setItem(
      'shopsphere_cart',
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  // =========================
  // CART COUNT
  // =========================

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );


  // =========================
  // ADD TO CART
  // =========================
// Find your addToCart function (likely in App.jsx) and modify it to include the image:
const addToCart = (product) => {
  setCartItems(prevItems => {
    // Check if product already exists in cart
    const existingItem = prevItems.find(item => item._id === product._id);

    let updatedItems;

    if (existingItem) {
      // Update quantity if item exists
      updatedItems = prevItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new item with all required fields
      updatedItems = [
        ...prevItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image, // Make sure this is included
          quantity: 1
        }
      ];
    }

    // Update localStorage
    localStorage.setItem('shopsphere_cart', JSON.stringify(updatedItems));

    return updatedItems;
  });
};

  // =========================
  // UPDATE CART QUANTITY
  // =========================

  const updateCartQuantity = (productId, quantity) => {

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: quantity
            }
          : item
      )
    );
  };


  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (productId) => {

    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item._id !== productId
      )
    );
  };
const clearCartAfterOrder = (orderData) => {
  // Clear cart items state
  setCartItems([]);

  // Remove cart from localStorage
  localStorage.removeItem('shopsphere_cart');

  // Store order information
  setOrderSuccess(orderData);

  // Navigate to order success page
  setCurrentPage('order-success');
};

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    authService.logout();

    setUser(null);

    setCurrentPage('home');
  };


  // =========================
  // LOGIN PAGE
  // =========================

  if (currentPage === 'login') {

    return (
      <div className="app">

        <button
          className="auth-back"
          onClick={() => setCurrentPage('home')}
        >
          ← Back to ShopSphere
        </button>

        <Login
          onLoginSuccess={(loggedInUser) => {

            setUser(loggedInUser);

            setCurrentPage('home');

          }}

          onRegisterClick={() => {
            setCurrentPage('register');
          }}
        />

      </div>
    );
  }


  // =========================
  // REGISTER PAGE
  // =========================

  if (currentPage === 'register') {

    return (
      <div className="app">

        <button
          className="auth-back"
          onClick={() => setCurrentPage('home')}
        >
          ← Back to ShopSphere
        </button>

        <Register
          onRegisterSuccess={() => {
            setCurrentPage('login');
          }}

          onLoginClick={() => {
            setCurrentPage('login');
          }}
        />

      </div>
    );
  }


  // =========================
  // PRODUCT DETAILS PAGE
  // =========================

  if (currentPage === 'product-details') {

    return (
      <div className="app">

        <Navbar
          cartCount={totalCartItems}
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

        <ProductDetails
          productId={selectedProductId}

          onBack={() => {
            setCurrentPage('home');
          }}

          onAddToCart={(product) => {

            addToCart(product);

            setCurrentPage('cart');

          }}
        />

        <Footer />

      </div>
    );
  }
// =========================
// ADMIN DASHBOARD PAGE
// =========================

if (currentPage === 'admin-dashboard') {
  return (
    <div className="app">
      <Navbar
        cartCount={totalCartItems}
        user={user}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentPage={currentPage}
      />

      <AdminDashboard
        user={user}
        setCurrentPage={setCurrentPage}
      />

      <Footer />
    </div>
  );
}
  // =========================
  // CART PAGE
  // =========================

  if (currentPage === 'cart') {

    return (
      <div className="app">

        <Navbar
          cartCount={totalCartItems}
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

       <Cart 
  cartItems={cartItems} 
  onUpdateQuantity={updateCartQuantity}
  onRemove={removeFromCart}
  onBack={() => setCurrentPage('home')}
  onCheckout={() => setCurrentPage('checkout')}
/>

        <Footer />

      </div>
    );
  }
  
if (currentPage === 'checkout') {
  return (
    <div className="app">
     <Navbar
  cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
  user={user}
  onNavigate={setCurrentPage}
  onLogout={logout}
  currentPage={currentPage}
/>

      <Checkout
        cartItems={cartItems}
        clearCart={clearCartAfterOrder}
        setOrderSuccess={setOrderSuccess}
      />

      <Footer />
    </div>
  );
}

if (currentPage === 'order-success' && orderSuccess) {
  return (
    <div className="app">
      <Navbar
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onNavClick={setCurrentPage}
        onLogout={handleLogout}
        currentPage={currentPage}
      />

      <div className="order-success">
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: {orderSuccess.orderId}</p>
        <p>Total Amount: ${orderSuccess.totalAmount.toFixed(2)}</p>
        <button
          onClick={() => {
            setOrderSuccess(null);
            setCurrentPage('home');
          }}
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>

      <Footer />
    </div>
  );
}
// Add these two conditions INSIDE function App(), AFTER the order-success condition
// and BEFORE the final Home Page return

if (currentPage === 'my-orders') {
  return (
    <div className="app">
      <Navbar
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
         onNavigate={setCurrentPage}
         onLogout={handleLogout}
        currentPage={currentPage}
        

      />
      <MyOrders
        setCurrentPage={setCurrentPage}
        setSelectedOrderId={setSelectedOrderId}
      />

      <Footer />
    </div>
  );
}

if (currentPage === 'order-details') {
  return (
    <div className="app">
      <Navbar
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
       onNavigate={setCurrentPage}
        currentPage={currentPage}
        onLogout={handleLogout}
      />

      <OrderDetails
        orderId={selectedOrderId}
        setCurrentPage={setCurrentPage}
      />

      <Footer />
    </div>
  );
}
  // =========================
  // ADMIN PRODUCT LIST PAGE
  // =========================

  if (currentPage === 'admin-product-list') {
    if (!user || user.role !== 'admin') {
      setCurrentPage('home');
      return null;
    }

    return (
      <div className="app">
        <Navbar
          cartCount={totalCartItems}
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

        <AdminProductList
          setCurrentPage={setCurrentPage}
          setSelectedProductId={setSelectedProductId}
        />

        <Footer />
      </div>
    );
  }

  // =========================
  // ADMIN PRODUCT FORM PAGE
  // =========================

  if (currentPage === 'admin-product-form') {
    if (!user || user.role !== 'admin') {
      setCurrentPage('home');
      return null;
    }

    return (
      <div className="app">
        <Navbar
          cartCount={totalCartItems}
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

        <AdminProductForm
          productId={selectedProductId}
          setCurrentPage={setCurrentPage}
        />

        <Footer />
      </div>
    );
  }

  // =========================
  // ADMIN ORDER LIST PAGE
  // =========================

  if (currentPage === 'admin-order-list') {
    if (!user || user.role !== 'admin') {
      setCurrentPage('home');
      return null;
    }

    return (
      <div className="app">
        <Navbar
          cartCount={totalCartItems}
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

        <AdminOrderList
          setCurrentPage={setCurrentPage}
          setSelectedOrderId={setSelectedOrderId}
        />

        <Footer />
      </div>
    );
  }

  // =========================
  // ADMIN ORDER DETAILS PAGE
  // =========================

  if (currentPage === 'admin-order-details') {
    if (!user || user.role !== 'admin') {
      setCurrentPage('home');
      return null;
    }

    return (
      <div className="app">
        <Navbar
          cartCount={totalCartItems}
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

        <AdminOrderDetails
          orderId={selectedOrderId}
          setCurrentPage={setCurrentPage}
        />

        <Footer />
      </div>
    );
  }

  // =========================
  // HOME PAGE
  // =========================

  return (
    <div className="app">

      <Navbar
        cartCount={totalCartItems}
        user={user}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentPage={currentPage}
      />

      <HeroSection />

      <CategoriesSection />

      <FeaturedProducts

        onViewProduct={(productId) => {

          setSelectedProductId(productId);

          setCurrentPage('product-details');

        }}

        onAddToCart={addToCart}

      />

      <Footer />

    </div>
  );
}

export default App;