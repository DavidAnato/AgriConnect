import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder au panier</p>
          <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits frais et commencez vos achats
            </p>
            <Link
              to="/catalog"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Voir le catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon panier</h1>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.product_name}
                  </h3>
                  <p className="text-lg font-bold text-green-600">
                    {Number(item.unit_price).toLocaleString()} FCFA
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      try {
                        setError(null);
                        const q = Number(item.quantity);
                        updateQuantity(Number(item.product), Math.max(q - 1, 0));
                      } catch (err: any) {
                        setError(err.message);
                      }
                    }}
                    className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {String(item.quantity)}
                  </span>
                  <button
                    onClick={() => {
                      try {
                        setError(null);
                        const q = Number(item.quantity);
                        updateQuantity(Number(item.product), q + 1);
                      } catch (err: any) {
                        setError(err.message);
                      }
                    }}
                    className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    {Number(item.subtotal).toLocaleString()} FCFA
                  </p>
                  <button
                    onClick={() => removeFromCart(Number(item.product))}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-green-600">
              {totalPrice.toLocaleString()} FCFA
            </span>
          </div>

          <div className="flex gap-4">
            <Link
              to="/catalog"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Continuer mes achats
            </Link>
            <button
              onClick={() => navigate('/consumer/checkout')}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Passer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
