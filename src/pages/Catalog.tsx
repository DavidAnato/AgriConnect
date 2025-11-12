import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';
import { apiService } from '../services/api';
import { useSearchParams } from 'react-router-dom';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [unitType, setUnitType] = useState(searchParams.get('unitType') || '');
  const [commune, setCommune] = useState(searchParams.get('commune') || '');
  const [village, setVillage] = useState(searchParams.get('village') || '');
  const [producer, setProducer] = useState(searchParams.get('producer') || '');
  const [categoryName, setCategoryName] = useState(searchParams.get('category_name') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-created_at');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const pageSize = 6;

  // Sticky state
  const [isSticky, setIsSticky] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (unitType) params.set('unitType', unitType);
    if (commune) params.set('commune', commune);
    if (village) params.set('village', village);
    if (producer) params.set('producer', producer);
    if (categoryName) params.set('category_name', categoryName);
    if (ordering !== '-created_at') params.set('ordering', ordering);
    if (currentPage !== 1) params.set('page', String(currentPage));
    setSearchParams(params);
  }, [searchTerm, unitType, commune, village, producer, categoryName, ordering, currentPage, setSearchParams]);

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
      category: typeof p.category === 'object' && p.category?.name
        ? { id: Number(p.category.id), name: String(p.category.name) }
        : (p.category || 'Autres'),
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

  const fetchProducts = async (debouncedSearch?: string, pageArg?: number) => {
    setLoading(true);
    try {
      const data = await apiService.getPublicProducts({
        unit_type: (unitType as "kg" | "unité" | undefined) || undefined,
        location_commune: commune || undefined,
        location_village: village || undefined,
        producer: producer ? Number(producer) : undefined,
        category_name: categoryName || undefined,
        search: debouncedSearch ?? (searchTerm || undefined),
        ordering: ordering || undefined,
        page: pageArg ?? currentPage,
        page_size: pageSize,
      });
      const results = (data?.results ?? []) as any[];
      setRawProducts(results);
      setProducts(results.map(mapToProduct));
      setTotalCount(Number(data?.count ?? 0));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load categories concurrently
    (async () => {
      try {
        const cats = await apiService.getCategories();
        const normalized = Array.isArray(cats) ? cats.map((c: any) => ({ id: Number(c.id), name: String(c.name) })) : [];
        setCategories(normalized);
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    })();

    fetchProducts('', 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    const h = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(searchTerm, 1);
    }, 300);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Refetch on filters/order change
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(undefined, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitType, commune, village, producer, categoryName, ordering]);

  // Refetch when page changes
  useEffect(() => {
    fetchProducts(undefined, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Handle scroll for sticky filters
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Remove derived categories; now loaded from API

  // Pagination (server-side)
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

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
          <div className={`hidden md:block md:col-span-1 ${isSticky ? 'sticky top-20 self-start' : ''}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-5 border border-gray-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900 text-lg">Filtres</h3>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Toutes</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d’unité</label>
                <div className="flex gap-2">
                  {['', 'kg', 'unité'].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnitType(u)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${unitType === u ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      {u === '' ? 'Tous' : u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Commune */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commune</label>
                <select
                  value={commune}
                  onChange={(e) => {
                    setCommune(e.target.value);
                    setVillage('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Toutes</option>
                  {communes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Tous</option>
                  {villages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Producer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Producteur</label>
                <select
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Tous</option>
                  {producers.map((p) => (
                    <option key={p} value={p}>#{p}</option>
                  ))}
                </select>
              </div>

              {/* Ordering */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="-created_at">Plus récents</option>
                  <option value="created_at">Plus anciens</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setUnitType('');
                  setCommune('');
                  setVillage('');
                  setProducer('');
                  setCategoryName('');
                  setOrdering('-created_at');
                  setCurrentPage(1);
                }}
                className="w-full mt-2 text-sm text-green-700 hover:text-green-900 underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Results + Search + top filters (mobile) */}
          <div className="md:col-span-3">
            <div className={`bg-white rounded-xl shadow-lg p-4 space-y-4 border border-gray-100 ${isSticky ? 'sticky top-20 z-10' : ''}`}>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Quick mobile filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:hidden">
                <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Catégorie</option>
                  {categories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                </select>
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
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-lg border transition ${currentPage === i + 1 ? 'bg-green-600 text-white border-green-600' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border transition ${currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
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
