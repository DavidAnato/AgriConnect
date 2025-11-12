import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { apiService } from '../services/api';

export default function Catalog() {
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [unitType, setUnitType] = useState<string>('');
  const [commune, setCommune] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [producer, setProducer] = useState<string>('');
  const [isPublishedOnly, setIsPublishedOnly] = useState<boolean>(true);
  const [ordering, setOrdering] = useState<string>('-created_at');

  // Pagination
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

  const fetchProducts = async (debouncedSearch?: string) => {
    setLoading(true);
    try {
      const data = await apiService.getPublicProducts({
        unit_type: (unitType as "kg" | "unité" | undefined) || undefined,
        is_published: isPublishedOnly ? true : undefined,
        location_commune: commune || undefined,
        location_village: village || undefined,
        producer: producer ? Number(producer) : undefined,
        search: debouncedSearch ?? (searchTerm || undefined),
        ordering: ordering || undefined,
      });
      setRawProducts(data || []);
      setProducts((data || []).map(mapToProduct));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProducts('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    const h = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Refetch on filters/order change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitType, commune, village, producer, isPublishedOnly, ordering]);

  // Dynamic options
  const communes = useMemo(() => {
    const set = new Set<string>();
    rawProducts.forEach((p) => p.location_commune && set.add(p.location_commune));
    return Array.from(set);
  }, [rawProducts]);

  const villages = useMemo(() => {
    const set = new Set<string>();
    rawProducts
      .filter((p) => (commune ? p.location_commune === commune : true))
      .forEach((p) => p.location_village && set.add(p.location_village));
    return Array.from(set);
  }, [rawProducts, commune]);

  const producers = useMemo(() => {
    const set = new Set<string>();
    rawProducts.forEach((p) => p.producer_id && set.add(String(p.producer_id)));
    return Array.from(set);
  }, [rawProducts]);

  // Pagination
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue des produits</h1>
          <p className="text-gray-600">Découvrez les produits frais de nos producteurs locaux</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Filters panel (desktop) */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filtres</h3>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type d’unité</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Tous</option>
                  <option value="kg">kg</option>
                  <option value="unité">unité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Commune</label>
                <select
                  value={commune}
                  onChange={(e) => {
                    setCommune(e.target.value);
                    setVillage('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  {communes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Village</label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Tous</option>
                  {villages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Producteur</label>
                <select
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Tous</option>
                  {producers.map((p) => (
                    <option key={p} value={p}>#{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Seulement publiés</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublishedOnly}
                    onChange={(e) => setIsPublishedOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${isPublishedOnly ? 'bg-green-600' : 'bg-gray-300'}`}>
                    <span className={`bg-white w-4 h-4 rounded-full shadow transform transition ${isPublishedOnly ? 'translate-x-5' : ''}`}></span>
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tri</label>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="-created_at">Plus récents</option>
                  <option value="created_at">Plus anciens</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results + Search + top filters (mobile) */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              {/* Quick mobile filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:hidden">
                <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Unité</option>
                  <option value="kg">kg</option>
                  <option value="unité">unité</option>
                </select>
                <select value={commune} onChange={(e) => { setCommune(e.target.value); setVillage(''); }} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Commune</option>
                  {communes.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
                <select value={village} onChange={(e) => setVillage(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Village</option>
                  {villages.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
                <select value={producer} onChange={(e) => setProducer(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Producteur</option>
                  {producers.map((p) => (<option key={p} value={p}>#{p}</option>))}
                </select>
              </div>
            </div>

              {/* Results */}
              <div className='p-5'>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg border ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-lg border ${currentPage === i + 1 ? 'bg-green-600 text-white border-green-600' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg border ${currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      Suivant
                    </button>
                  </div>
                </>
              )}
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}
