import { useAuth } from '../../contexts/AuthContext.tsx';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          apiService.getUsers(),
          apiService.getProducts(),
          apiService.getOrders(),
        ]);

        setStats({
          totalUsers: users.length,
          totalProducers: users.filter((u: any) => u.role === 'producer').length,
          totalProducts: products.length,
          totalOrders: orders.length,
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
      <div className="max-w-6xl mx-auto my-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tableau de bord Administrateur
          </h1>
          <p className="text-gray-600 mb-4">
            Bienvenue, {user?.first_name || user?.email}!
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Vous êtes connecté en tant qu'administrateur. Gérez les utilisateurs, 
              modérez le contenu et surveillez l'activité du site.
            </p>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Utilisateurs</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Producteurs</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.totalProducers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Produits</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Commandes</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.totalOrders}</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gérer les utilisateurs</h3>
            <p className="text-gray-600 mb-4">Modérer, activer et administrer les comptes.</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">Accéder</button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Modérer les produits</h3>
            <p className="text-gray-600 mb-4">Valider, refuser et contrôler les annonces.</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">Accéder</button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Suivre les commandes</h3>
            <p className="text-gray-600 mb-4">Surveiller les transactions et litiges.</p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">Accéder</button>
          </div>
        </div>

        {/* Activité récente & Santé système */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
            <ul className="space-y-3">
              {[
                'Nouveau producteur inscrit',
                'Produit modéré: Tomates bio',
                'Commande #12345 validée',
                'Utilisateur promu au rôle producteur',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mt-1 mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Santé du système</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">API</span>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">Opérationnel</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Base de données</span>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">Connectée</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Files d’attente</span>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">Normal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Utilisateurs</h3>
            <p className="text-gray-600 mb-4">Gérez les comptes utilisateurs</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Gérer les utilisateurs
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Produits</h3>
            <p className="text-gray-600 mb-4">Modérez les produits</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
              Modérer les produits
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
            <p className="text-gray-600 mb-4">Vue d'ensemble du site</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Voir les stats
            </button>
          </div>
        </div>
      </div>
  );
}