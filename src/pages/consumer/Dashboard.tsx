import { Link } from 'react-router-dom';
import { ShoppingBag, Package, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ConsumerDashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon espace</h1>
          <p className="text-gray-600 mt-2">Bienvenue, {profile?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/consumer/orders"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <Package className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes commandes</h2>
            <p className="text-gray-600">Suivez l'état de vos commandes</p>
          </Link>

          <Link
            to="/catalog"
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-8 hover:shadow-lg transition text-white"
          >
            <ShoppingBag className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Catalogue</h2>
            <p className="text-green-100">Découvrez les produits frais</p>
          </Link>

          <Link
            to="/consumer/profile"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
          >
            <User className="h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h2>
            <p className="text-gray-600">Gérez vos informations</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
