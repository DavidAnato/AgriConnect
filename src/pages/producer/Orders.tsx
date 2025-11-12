import { useState, useEffect } from 'react';
import { Package, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';

export default function ProducerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const vendorOrders = await apiService.getVendorOrders();
      // Tri par created_at desc si disponible
      const sorted = Array.isArray(vendorOrders)
        ? vendorOrders.sort((a, b) => {
            const da = new Date(a.created_at ?? a.createdAt ?? 0).getTime();
            const db = new Date(b.created_at ?? b.createdAt ?? 0).getTime();
            return db - da;
          })
        : [];
      setOrders(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes producteur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remarque: pas d'endpoint de mise à jour du statut côté producteur fourni

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

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">Commandes reçues</h1>
          <p className="text-gray-600 mt-2">{orders.length} commande(s) au total</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'confirmed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Livrées
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'Vous n\'avez pas encore reçu de commandes'
                : `Aucune commande ${filter === 'pending' ? 'en attente' : filter === 'confirmed' ? 'confirmée' : 'livrée'}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Commande #{order.id}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    Articles : <span className="font-medium">{Array.isArray(order.items) ? order.items.length : 0}</span>
                  </p>
                  <p>
                    Total : <span className="font-medium text-green-600 text-lg">{Number(order.total || 0).toLocaleString()} FCFA</span>
                  </p>
                  {order.shipping_address && (
                    <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-0.5" /> <span>{order.shipping_address}</span></p>
                  )}
                  {(order.created_at || order.createdAt) && (
                    <p className="text-xs text-gray-500">Commandé le {new Date(order.created_at ?? order.createdAt).toLocaleDateString('fr-FR')}</p>
                  )}
                </div>
                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Détails des articles</h4>
                    <ul className="divide-y divide-gray-100">
                      {order.items.map((it: any) => (
                        <li key={it.id ?? `${it.product}-${it.product_name}`} className="py-2 flex items-center justify-between text-sm">
                          <span className="text-gray-700">{it.product_name}</span>
                          <span className="text-gray-600">x {Number(it.quantity).toLocaleString()}</span>
                          <span className="text-green-700 font-medium">{Number(it.subtotal || 0).toLocaleString()} FCFA</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
