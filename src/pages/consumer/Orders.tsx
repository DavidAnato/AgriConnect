import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Order } from '../../types';
import { apiService } from '../../services/api';

export default function ConsumerOrders() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const showSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userOrders = await apiService.getOrdersByUser(profile?.id || '');
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-semibold">
                Commande passée avec succès !
              </p>
              <p className="text-green-700 text-sm">
                Les producteurs vont vous contacter pour confirmer la livraison.
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune commande pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits frais et passez votre première commande
            </p>
            <Link
              to="/catalog"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      {order.product?.image_url ? (
                        <img
                          src={order.product.image_url}
                          alt={order.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {order.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} articles
                      </p>
                      <p className="text-xs text-gray-500">
                        Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-xl font-bold text-green-600 mt-2">
                      {order.total.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Adresse de livraison :</span>{' '}
                    {order.delivery_address}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Téléphone :</span> {order.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
