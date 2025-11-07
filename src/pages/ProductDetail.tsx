import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Calendar, Truck, Shield, Clock, Award, Package, User, Phone, Mail, MapPin, Store } from 'lucide-react';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        console.error('ID de produit invalide:', id);
        setProduct(null);
        return;
      }
      const data = await apiService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Vérifier le stock disponible
      const availableQuantity = (product?.quantity_available ?? product?.stock ?? 0);
      if (quantity > availableQuantity) {
        alert(`Désolé, seulement ${availableQuantity} ${product.unit} disponibles.`);
        return;
      }

      await addToCart(product, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Optionnel: Réinitialiser la quantité après l'ajout
      // setQuantity(1);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center m-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
            <Link
              to="/catalog"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculer la note moyenne
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  // Vérifier si le produit est nouveau (moins de 7 jours)
  const isNew = new Date() - new Date(product.created_at) < 7 * 24 * 60 * 60 * 1000;
  
  // Disponibilité calculée à partir de quantity_available ou stock
  const availableQuantity = (product?.quantity_available ?? product?.stock ?? 0);
  const isAvailable = availableQuantity > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showSuccess && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Produit ajouté au panier !</span>
              </div>
            </div>
          )}

          <Link to="/catalog" className="text-green-600 hover:text-green-700 mb-6 inline-block">
            ← Retour au catalogue
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Package className="h-24 w-24 text-green-400" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {isNew && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Nouveau
                    </span>
                  )}
                  {product.on_sale && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      En promotion
                    </span>
                  )}
                </div>

                {/* Badge de statut */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isAvailable ? 'Disponible' : 'Épuisé'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-gray-600 mb-4">{product.category}</p>
                  
                  {/* Note moyenne */}
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">
                        {averageRating.toFixed(1)} ({product.reviews.length} avis)
                      </span>
                    </div>
                  )}
                  
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {product.price.toLocaleString()} FCFA
                    {product.unit && <span className="text-lg text-gray-600"> / {product.unit}</span>}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">{product.description}</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{product.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Mis en ligne le {new Date(product.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    {product.delivery_options && (
                      <div className="flex items-center text-gray-600">
                        <Truck className="h-5 w-5 mr-2" />
                        <span>Livraison disponible</span>
                      </div>
                    )}
                    
                    {product.organic && (
                      <p className="text-green-600 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        <span className="font-semibold">Produit biologique certifié</span>
                      </p>
                    )}
                  </div>
                </div>

                {profile?.role === 'consumer' && isAvailable && (
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Quantité ({product.unit})
                       </label>
                       <div className="flex items-center space-x-3">
                         <button
                           onClick={() => setQuantity(Math.max(1, quantity - 1))}
                           className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                         >
                           -
                         </button>
                         <input
                           type="number"
                           min="1"
                           max={availableQuantity}
                           value={quantity}
                           onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                           className="w-20 text-center border border-gray-300 rounded-lg py-2"
                         />
                         <button
                           onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
                           className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                         >
                           +
                         </button>
                       </div>
                     </div>

                     <button
                       onClick={handleAddToCart}
                       className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
                     >
                       <ShoppingCart className="h-5 w-5" />
                       <span>Ajouter au panier</span>
                     </button>

                     <p className="text-center text-gray-600 text-sm">
                       Total : <span className="font-semibold">{(product.price * quantity).toLocaleString()} FCFA</span>
                     </p>
                     
                    {availableQuantity <= 5 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-700 text-sm font-medium">
                          ⚠️ Plus que {availableQuantity} {product.unit} disponibles !
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!user && (
                  <Link
                    to="/login"
                    className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
                  >
                    Connectez-vous pour commander
                  </Link>
                )}
              </div>
            </div>

            {product.producer && (
              <div className="border-t border-gray-200 p-8 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Store className="h-6 w-6 mr-2 text-green-600" />
                  À propos du producteur
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.producer.full_name}</p>
                      <p className="text-gray-600 text-sm">{product.producer.location || product.location}</p>
                      {product.producer.address && (
                        <p className="text-gray-500 text-xs">{product.producer.address}</p>
                      )}
                    </div>
                  </div>
                  
                  {product.producer.description && (
                    <p className="text-gray-600 text-sm mb-4">{product.producer.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {product.producer.phone && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${product.producer.phone}`} className="text-green-600 hover:text-green-700">
                          {product.producer.phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${product.producer.email}`} className="text-green-600 hover:text-green-700">
                        {product.producer.email}
                      </a>
                    </div>
                    
                    {product.producer.location && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{product.producer.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Producteur local engagé dans l'agriculture durable</span>
                  </div>
                  
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                    Voir le profil complet
                    <Phone className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Avis clients */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="border-t border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-yellow-400" />
                  Avis clients ({product.reviews.length})
                </h2>
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.user_name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              {new Date(review.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produits similaires */}
            <div className="border-t border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Découvrez d'autres produits de la même catégorie</p>
                  <Link 
                    to={`/catalog?category=${product.category}`}
                    className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Voir la catégorie {product.category}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
