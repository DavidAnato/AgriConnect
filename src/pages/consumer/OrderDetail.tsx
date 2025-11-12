import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderId = Number(id);
        if (!orderId) throw new Error('ID de commande invalide');
        const data = await apiService.getCommerceOrder(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err?.message || 'Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Link to="/consumer/orders" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg">Retour aux commandes</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Commande #{order.id}</h1>
          <p className="text-gray-600">Statut: <span className="font-medium">{order.status}</span></p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Résumé</h2>
              <p className="text-sm text-gray-700">Total: <span className="text-green-700 font-semibold">{Number(order.total || 0).toLocaleString()} FCFA</span></p>
              {order.shipping_address && (
                <p className="text-sm text-gray-700 flex items-start mt-2"><MapPin className="h-4 w-4 mr-2 mt-0.5" /> <span>{order.shipping_address}</span></p>
              )}
              {(order.created_at || order.createdAt) && (
                <p className="text-xs text-gray-500 mt-2">Créée le {new Date(order.created_at ?? order.createdAt).toLocaleDateString('fr-FR')}</p>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Producteur</h2>
              {order.producer ? (
                <p className="text-sm text-gray-700">ID: {order.producer}</p>
              ) : (
                <p className="text-sm text-gray-500">Information producteur non disponible</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Articles</h3>
            {Array.isArray(order.items) && order.items.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {order.items.map((it: any) => (
                  <li key={it.id ?? `${it.product}-${it.product_name}`} className="py-2 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{it.product_name}</span>
                    <span className="text-gray-600">x {Number(it.quantity).toLocaleString()}</span>
                    <span className="text-green-700 font-medium">{Number(it.subtotal || 0).toLocaleString()} FCFA</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-6">
                <Package className="h-8 w-8 mx-auto mb-2" />
                Aucun article
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link to="/consumer/orders" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200">Retour</Link>
        </div>
      </div>
    </div>
  );
}