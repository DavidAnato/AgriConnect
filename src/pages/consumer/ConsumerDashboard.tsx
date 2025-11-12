import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProductCard from "../../components/ProductCard";
import { Product } from "../../types";
import { apiService } from "../../services/api";

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const mapToProduct = (p: any): Product => {
    const price = Number(p.unit_price ?? 0);
    const unit = p.unit_type ?? "unité";
    const location = [p.location_village, p.location_commune].filter(Boolean).join(", ");
    const description = p.short_description || p.long_description || "";
    const image_url = p.image || undefined;
    const status: Product["status"] = Number(p.quantity_available || 0) > 0 ? "available" : "sold_out";
    return {
      id: Number(p.id),
      name: p.name,
      description,
      category: p.category || "Autres",
      price,
      unit,
      quantity_available: Number(p.quantity_available || 0),
      location,
      image_url,
      status,
      created_at: p.created_at || new Date().toISOString(),
      producer: p.producer_id ? { id: String(p.producer_id), full_name: "", location: location, email: "" } : undefined,
    };
  };

  useEffect(() => {
    const loadLatest = async () => {
      setLoading(true);
      try {
        const data = await apiService.getPublicProducts({
          is_published: true,
          ordering: "-created_at",
          page: 1,
          page_size: 3,
        });
        const results = (data?.results ?? []) as any[];
        setProducts(results.map(mapToProduct));
      } catch (error) {
        console.error("Error loading latest products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLatest();
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Mon espace
          </h1>
          <p className="text-gray-600 mb-4">
            Bienvenue, {user?.first_name || user?.email}!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Vous êtes connecté en tant que consommateur. Découvrez nos produits locaux 
              et soutenez les producteurs de votre région.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Catalogue Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18l-2 13H5L3 3zm0 0l-1-1m16 1l1-1M7 8h10M7 12h10m-7 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Catalogue</h3>
            </div>
            <p className="text-gray-600 mb-5">Parcourez nos produits locaux frais et de saison</p>
            <Link
              to="/catalog"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              <span>Voir le catalogue</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Mes Commandes</h3>
            </div>
            <p className="text-gray-600 mb-5">Suivez l’état de vos commandes en temps réel</p>
            <Link
              to="/consumer/orders"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <span>Voir mes commandes</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Derniers produits & Infos compte */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Derniers produits</h2>
              <Link to="/catalog" className="text-sm text-green-700 hover:text-green-800">Voir tout</Link>
            </div>
            {loading ? (
              <p className="text-gray-600">Chargement…</p>
            ) : products.length === 0 ? (
              <p className="text-gray-600">Aucun produit disponible pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations compte</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email</span>
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Nom</span>
                <span className="text-gray-900 font-medium">{(user?.first_name || '') + ' ' + (user?.last_name || '')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Statut</span>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">Actif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Besoin d’aide ?</h3>
            <p className="text-gray-700">Contactez le support pour toute question sur vos commandes.</p>
          </div>
          <button className="mt-3 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Contacter le support</button>
        </div>
      </div>
  );
}