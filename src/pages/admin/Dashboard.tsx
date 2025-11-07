import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, products, orders] = await Promise.all([
        apiService.getUsers(),
        apiService.getProducts(),
        apiService.getOrders()
      ]);

      setStats({
        totalUsers: users.length,
        totalProducers: users.filter(user => user.role === 'producer').length,
        totalProducts: products.length,
        totalOrders: orders.length
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
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">Tableau de bord général</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Utilisateurs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Producteurs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Produits</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Commandes</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <Users className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateurs</h2>
            <p className="text-gray-600">Gérer les comptes utilisateurs et producteurs</p>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <Package className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produits</h2>
            <p className="text-gray-600">Modérer les annonces de produits</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <ShoppingBag className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commandes</h2>
            <p className="text-gray-600">Suivre toutes les transactions</p>
          </Link>

          <Link
            to="/admin/stats"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistiques</h2>
            <p className="text-gray-600">Analyser l'activité de la plateforme</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
