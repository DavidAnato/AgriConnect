import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import OrderSuccess from './pages/consumer/OrderSuccess';
import Layout from './components/Layout/Layout';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
import SetPassword from './pages/auth/SetPassword';
import Profile from './pages/Profile';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';

import ProducerDashboard from './pages/producer/ProducerDashboard';
import ProducerProducts from './pages/producer/Products';
import ProductForm from './pages/producer/ProductForm';
import ProducerOrders from './pages/producer/Orders';

import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import Cart from './pages/consumer/Cart';
import Checkout from './pages/consumer/Checkout';
import ConsumerOrders from './pages/consumer/Orders';
import OrderDetail from './pages/consumer/OrderDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
            <Route path="/change-password" element={<Layout><ChangePassword /></Layout>} />
            <Route path="/set-password" element={<Layout><SetPassword /></Layout>} />
            <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />

            <Route
              path="/producer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['producer']}>
                  <Layout><ProducerDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/producer/products"
              element={
                <ProtectedRoute allowedRoles={['producer']}>
                  <Layout><ProducerProducts /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/producer/products/new"
              element={
                <ProtectedRoute allowedRoles={['producer']}>
                  <Layout><ProductForm /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/producer/products/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['producer']}>
                  <Layout><ProductForm /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/producer/orders"
              element={
                <ProtectedRoute allowedRoles={['producer']}>
                  <Layout><ProducerOrders /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/consumer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Layout><ConsumerDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Layout><Cart /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consumer/checkout"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Layout><Checkout /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consumer/orders"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Layout><ConsumerOrders /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consumer/orders/:id"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Layout><OrderDetail /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consumer/order-success"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Layout><OrderSuccess /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
