import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Product } from '../../types';
import { apiService } from '../../services/api';
export default function ProducerProducts() {
  const { user } = useAuth();
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const mapToProduct = (p: any): Product => {
    const price = Number(p.unit_price ?? 0);
    const unit = p.unit_type ?? 'unité';
    const location = [p.location_village, p.location_commune].filter(Boolean).join(', ');
    const description = p.short_description || p.long_description || '';
    const image_url = p.image || undefined;
    const status: Product['status'] = Number(p.quantity_available || 0) > 0 ? 'available' : 'sold_out';
    return {
      id: Number(p.id),
      name: p.name,
      description,
      category: p.category || 'Autres',
      price,
      unit,
      quantity_available: Number(p.quantity_available || 0),
      location,
      image_url,
      status,
      created_at: p.created_at || new Date().toISOString(),
      producer: p.producer_id ? { id: String(p.producer_id), full_name: '', location: location, email: '' } : undefined,
    };
  };

  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadProducts = async (pageArg?: number) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await apiService.getProducerProducts(user.id, true, pageArg ?? currentPage, pageSize);
      const results = (data?.results ?? []) as any[];
      setRawProducts(results);
      setTotalCount(Number(data?.count ?? results.length));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDelete = async (id: number | string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    try {
      await apiService.deleteProduct(id);
      setRawProducts(prev => prev.filter((p) => Number(p.id) !== Number(id)));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleTogglePublish = async (id: number | string) => {
    try {
      const current = rawProducts.find(p => Number(p.id) === Number(id));
      const next = !current?.is_published;
      await apiService.setProductPublished(id, next);
      const updated = rawProducts.map(p => Number(p.id) === Number(id) ? { ...p, is_published: next } : p);
      setRawProducts(updated);
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const getStatusBadge = (is_published: boolean) => {
    const styles = is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    const label = is_published ? 'Publié' : 'Non publié';
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles}`}>
        {label}
      </span>
    );
  };

  const filtered = useMemo(() => {
    let list = rawProducts.slice();
    if (publishedFilter !== 'all') {
      const wantPublished = publishedFilter === 'published';
      list = list.filter(p => Boolean(p.is_published) === wantPublished);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        String(p.name).toLowerCase().includes(q) ||
        String(p.short_description || '').toLowerCase().includes(q) ||
        String(p.location_commune || '').toLowerCase().includes(q) ||
        String(p.location_village || '').toLowerCase().includes(q)
      );
    }
    return list.map(mapToProduct);
  }, [rawProducts, searchTerm, publishedFilter]);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes produits</h1>
            <p className="text-gray-600 mt-2">{totalCount} produit(s)</p>
          </div>
          <Link
            to="/producer/products/new"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau produit</span>
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Rechercher dans vos produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="published">Publié</option>
              <option value="unpublished">Non publié</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier produit
            </p>
            <Link
              to="/producer/products/new"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((product) => {
                    const raw = rawProducts.find(p => Number(p.id) === Number(product.id));
                    const is_published = Boolean(raw?.is_published);
                    return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">{product.category.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.price.toLocaleString()} FCFA
                        </div>
                        <div className="text-sm text-gray-500">/ {product.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.quantity_available} {product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(is_published)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/producer/products/edit/${product.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(product.id)}
                            className={is_published ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}
                            title={is_published ? 'Dépublier' : 'Publier'}
                          >
                            {is_published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center mt-6 mb-6 space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                Précédent
              </button>
              {Array.from({ length: Math.max(1, Math.ceil(totalCount / pageSize)) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg border ${currentPage === i + 1 ? 'bg-green-600 text-white border-green-600' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                className={`px-3 py-2 rounded-lg border ${currentPage >= Math.ceil(totalCount / pageSize) ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
