import { Link } from 'react-router-dom';
import { MapPin, Package, User, Calendar, Star, Truck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculer la note moyenne si elle existe
  const averageRating = product.rating || 0;
  const isNew = product.created_at && 
    new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div className="relative h-48 bg-gray-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
            <Package className="h-16 w-16 text-green-600" />
          </div>
        )}
        
        {/* Badge Nouveau */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Nouveau
          </div>
        )}
        
        {/* Badge Épuisé */}
        {product.status === 'sold_out' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg">Épuisé</span>
          </div>
        )}
        
        {/* Badge Promotion */}
        {product.status === 'on_sale' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Promo
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{product.name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Note et producteur */}
        <div className="flex items-center justify-between mb-2">
          {averageRating > 0 && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">({averageRating})</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            <span className="truncate">{product.producer_name || 'Producteur local'}</span>
          </div>
        </div>

        {/* Localisation */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">{product.location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        {/* Informations de disponibilité et livraison */}
        {product.status !== 'sold_out' && (
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
            <span>
              {product.quantity_available} {product.unit} disponibles
            </span>
            {product.delivery_options && product.delivery_options.length > 0 && (
              <div className="flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                <span>Livraison disponible</span>
              </div>
            )}
          </div>
        )}

        {/* Prix et bouton */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">
              {product.price.toLocaleString()} FCFA
            </span>
            <span className="text-sm text-gray-600">/{product.unit}</span>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
            Voir le produit
          </button>
        </div>
      </div>
    </Link>
  );
}
