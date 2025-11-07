import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Clock, Home, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/consumer/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Icône de succès */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h1>
            <p className="text-gray-600">
              Votre commande a été enregistrée avec succès
            </p>
          </div>

          {/* Informations de suivi */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <Package className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">Prochaines étapes</span>
            </div>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• Le producteur va vous contacter sous peu</li>
              <li>• Préparation de votre commande</li>
              <li>• Livraison prévue dans 2-3 jours</li>
              <li>• Paiement à la livraison</li>
            </ul>
          </div>

          {/* Compteur de redirection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Redirection vers vos commandes dans {countdown} secondes...
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Link
              to="/consumer/orders"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
            >
              <Package className="h-4 w-4 mr-2" />
              Voir mes commandes
            </Link>
            
            <Link
              to="/catalog"
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Link>

            <Link
              to="/"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}