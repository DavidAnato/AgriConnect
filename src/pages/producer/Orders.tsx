import { useState, useEffect } from 'react';
import { Package, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Order } from '../../types';
import { apiService } from '../../services/api';

export default function ProducerOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const orders = await apiService.getOrders();
      const products = await apiService.getProducts();
      const users = await apiService.getUsers();

      const producerProducts = products.filter(p => p.producerId === profile?.id);
      const producerOrders = orders.filter(order => 
        order.items.some(item => 
          producerProducts.some(product => product.id === item.productId)
        )
      );

      const enrichedOrders = producerOrders.map(order => ({
        ...order,
        consumer: users.find(u => u.id === order.userId)
      }));

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrder(parseInt(orderId), { status: newStatus as Order['status'] });

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.product?.name}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        Quantité : <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} articles</span>
                      </p>
                      <p>
                        Total : <span className="font-medium text-green-600 text-lg">
                          {order.total.toLocaleString()} FCFA
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations client</h4>
                    <div className="space-y-2 text-sm">
                      {order.consumer && (
                        <div className="flex items-center text-gray-600">
                          <Package className="h-4 w-4 mr-2" />
                          <span>{order.consumer.full_name}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${order.phone}`} className="hover:text-green-600">
                          {order.phone}
                        </a>
                      </div>
                      {order.consumer?.email && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${order.consumer.email}`} className="hover:text-green-600">
                            {order.consumer.email}
                          </a>
                        </div>
                      )}
                      <div className="flex items-start text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                        <span>{order.delivery_address}</span>
                      </div>
                    </div>

                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mt-4 flex gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'confirmed')}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            Confirmer
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            Marquer comme livrée
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
