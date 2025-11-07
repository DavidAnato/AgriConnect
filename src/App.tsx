import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import OrderSuccess from './pages/consumer/OrderSuccess';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';

import ProducerDashboard from './pages/producer/Dashboard';
import ProducerProducts from './pages/producer/Products';
import ProductForm from './pages/producer/ProductForm';
import ProducerOrders from './pages/producer/Orders';

import ConsumerDashboard from './pages/consumer/Dashboard';
import Cart from './pages/consumer/Cart';
import Checkout from './pages/consumer/Checkout';
import ConsumerOrders from './pages/consumer/Orders';

import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                <Route
                  path="/producer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['producer']}>
                      <ProducerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/producer/products"
                  element={
                    <ProtectedRoute allowedRoles={['producer']}>
                      <ProducerProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/producer/products/new"
                  element={
                    <ProtectedRoute allowedRoles={['producer']}>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/producer/products/edit/:id"
                  element={
                    <ProtectedRoute allowedRoles={['producer']}>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/producer/orders"
                  element={
                    <ProtectedRoute allowedRoles={['producer']}>
                      <ProducerOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/consumer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <ConsumerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consumer/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consumer/orders"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <ConsumerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consumer/order-success"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
