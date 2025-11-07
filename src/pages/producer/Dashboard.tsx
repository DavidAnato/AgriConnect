import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

export default function ProducerDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const products = await apiService.getProducts();
      const orders = await apiService.getOrders();

      const producerProducts = products.filter(p => p.producerId === profile?.id);
      const producerOrders = orders.filter(order => 
        order.items.some(item => 
          producerProducts.some(product => product.id === item.productId)
        )
      );

      const activeProducts = producerProducts.filter(p => p.availableQuantity > 0).length;
      const totalRevenue = producerOrders.reduce((sum, order) => sum + order.total, 0);

      setStats({
        totalProducts: producerProducts.length,
        activeProducts,
        totalOrders: producerOrders.length,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Bienvenue, {profile?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Produits total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Produits actifs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Commandes</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Revenu total</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.revenue.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/producer/products"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <Package className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes produits</h2>
            <p className="text-gray-600">Gérez vos produits, stocks et prix</p>
          </Link>

          <Link
            to="/producer/products/new"
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-8 hover:shadow-lg transition text-white"
          >
            <Plus className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ajouter un produit</h2>
            <p className="text-green-100">Créer une nouvelle annonce</p>
          </Link>

          <Link
            to="/producer/orders"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <ShoppingBag className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commandes reçues</h2>
            <p className="text-gray-600">Gérez les commandes de vos clients</p>
          </Link>

          <Link
            to="/producer/profile"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h2>
            <p className="text-gray-600">Modifiez vos informations</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
