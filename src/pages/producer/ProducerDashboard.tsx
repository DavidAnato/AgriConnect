import { useAuth } from '../../contexts/AuthContext.tsx';
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';

export default function ProducerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    revenue: 0,
    itemsSold: 0,
    byStatus: {} as Record<string, number>,
    topProducts: [] as Array<{ product_name: string; quantity_sold: number; revenue: number }>,
    period: { start: '', end: '' }
  });
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize default period to current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    setStart((s) => s || fmt(startOfMonth));
    setEnd((e) => e || fmt(endOfMonth));
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        // getProducerProducts now returns a paginated object { results, count }
        const productsData = await apiService.getProducerProducts(user.id, true, 1, 1000);
        const products = Array.isArray(productsData?.results)
          ? (productsData.results as any[])
          : (Array.isArray(productsData) ? (productsData as any[]) : []);
        const totalProducts = Number(productsData?.count ?? products.length);
        const activeProducts = products.filter((p: any) => Number(p.availableQuantity ?? p.quantity_available ?? 0) > 0).length;

        // Fetch vendor stats for the selected period
        const vendorStats = await apiService.getVendorStats({ start, end });
        const totals = vendorStats?.totals || {};

        setStats({
          totalProducts,
          activeProducts,
          totalOrders: Number(totals.orders || 0),
          revenue: Number(totals.revenue || 0),
          itemsSold: Number(totals.items_sold || 0),
          byStatus: vendorStats?.by_status || {},
          topProducts: vendorStats?.top_products || [],
          period: vendorStats?.period || { start, end }
        });
      } catch (error) {
        console.error('Error loading producer stats:', error);
      } finally {
        setLoading(false);
      }
    };
    if (start && end) {
      loadStats();
    }
  }, [user?.id, start, end]);

  return (
      <div className="max-w-6xl mx-auto my-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tableau de bord Producteur
          </h1>
          <p className="text-gray-600 mb-4">
            Bienvenue, {user?.first_name || user?.email}!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-green-800">
                Vous êtes connecté en tant que producteur. Gérez vos produits et consultez vos statistiques.
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Période:</label>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                <span className="text-gray-500">→</span>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border rounded px-2 py-1 text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/producer/products" className="bg-white rounded-xl shadow-md p-6 block hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Produits total</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.totalProducts}</p>
          </Link>

          <Link to="/producer/products" className="bg-white rounded-xl shadow-md p-6 block hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Produits actifs</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.activeProducts}</p>
          </Link>

          <Link to="/producer/orders" className="bg-white rounded-xl shadow-md p-6 block hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Commandes</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stats.totalOrders}</p>
          </Link>

          <Link to="/producer/orders" className="bg-white rounded-xl shadow-md p-6 block hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Revenu (période)</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : `${stats.revenue.toLocaleString()} FCFA`}</p>
          </Link>
        </div>

        {/* Sections basées sur les données API */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Boutique (données produits) */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Boutique</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Produits total</span>
                <span className="text-gray-900 font-medium">{loading ? '—' : stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Produits actifs</span>
                <span className="text-gray-900 font-medium">{loading ? '—' : stats.activeProducts}</span>
              </div>
            </div>
          </div>

          {/* Statistiques de la période (vendor-stats) */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Statistiques de la période</h2>
              <span className="text-sm text-gray-600">{loading ? '' : `du ${stats.period.start} au ${stats.period.end}`}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.totalOrders}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600">Articles vendus</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.itemsSold}</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-600">Revenu</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : `${stats.revenue.toLocaleString()} FCFA`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statuts des commandes (vendor-stats.by_status) */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statuts des commandes</h2>
          {loading ? (
            <p className="text-gray-600">Chargement…</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(stats.byStatus || {}).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="capitalize text-gray-700">{k}</span>
                  <span className="text-gray-900 font-semibold">{v}</span>
                </div>
              ))}
              {Object.keys(stats.byStatus || {}).length === 0 && (
                <p className="text-gray-600">Aucun statut disponible sur la période.</p>
              )}
            </div>
          )}
        </div>

        {/* Top produits sur la période */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top produits (période)</h2>
          {loading ? (
            <p className="text-gray-600">Chargement…</p>
          ) : stats.topProducts.length === 0 ? (
            <p className="text-gray-600">Aucun produit sur la période sélectionnée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Produit</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantité vendue</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Revenu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.topProducts.map((p) => (
                    <tr key={p.product_name}>
                      <td className="px-4 py-2 text-gray-900">{p.product_name}</td>
                      <td className="px-4 py-2 text-gray-700">{Number(p.quantity_sold).toLocaleString()}</td>
                      <td className="px-4 py-2 text-gray-700">{Number(p.revenue).toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sections purement API conservées ci-dessus; contenu statique supprimé */}
      </div>
  );
}