import { Link } from 'react-router-dom';
import { ShoppingBag, Leaf, Users, TrendingUp, Package, Store, MapPin, Phone, Star, Truck, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, profile } = useAuth();
  return (
    <div className="min-h-screen">
      {/* Hero Section - Personnalisée selon le type d'utilisateur */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Message personnalisé pour les consommateurs connectés */}
            {user && profile?.role === 'consumer' && (
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Bonjour {profile.full_name || 'cher consommateur'} !
                  <span className="text-green-600"> Découvrez nos produits frais</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                  Commandez directement chez nos producteurs locaux et recevez des produits frais chez vous.
                  Soutenez l'agriculture locale tout en profitant de la meilleure qualité.
                </p>
              </div>
            )}

            {/* Message personnalisé pour les producteurs connectés */}
            {user && profile?.role === 'producer' && (
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Bonjour {profile.full_name || 'cher producteur'} !
                  <span className="text-green-600"> Gérez votre exploitation</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                  Gérez vos produits, suivez vos commandes et développez votre clientèle.
                  AgriConnect vous aide à vendre directement aux consommateurs.
                </p>
              </div>
            )}

            {/* Message par défaut pour les visiteurs non connectés */}
            {!user && (
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Du champ à votre table,
                  <span className="text-green-600"> directement</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                  AgriConnect met en relation les producteurs locaux avec les consommateurs.
                  Achetez des produits frais, soutenez l'agriculture locale.
                </p>
              </div>
            )}

            {/* Boutons d'action personnalisés */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Package className="h-5 w-5" />
                {user && profile?.role === 'consumer' ? 'Voir les produits' : 
                 user && profile?.role === 'producer' ? 'Voir le catalogue' : 'Explorer les produits'}
              </Link>
              
              {!user && (
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition"
                >
                  Devenir producteur
                </Link>
              )}

              {user && profile?.role === 'producer' && (
                <Link
                  to="/producer/products"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition flex items-center justify-center gap-2"
                >
                  <Store className="h-5 w-5" />
                  Mes produits
                </Link>
              )}

              {user && profile?.role === 'consumer' && (
                <Link
                  to="/consumer/orders"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  Mes commandes
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section avantages - Personnalisée selon le rôle */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {!user ? 'Pourquoi choisir AgriConnect ?' :
             user && profile?.role === 'consumer' ? 'Vos avantages consommateurs' :
             'Vos avantages producteurs'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 - Adaptée selon le rôle */}
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {!user ? <Leaf className="h-8 w-8 text-green-600" /> :
                 user && profile?.role === 'consumer' ? <Shield className="h-8 w-8 text-green-600" /> :
                 <TrendingUp className="h-8 w-8 text-green-600" />}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {!user ? 'Produits frais' :
                 user && profile?.role === 'consumer' ? 'Qualité garantie' :
                 'Meilleurs revenus'}
              </h3>
              <p className="text-gray-600">
                {!user ? 'Achetez directement depuis le champ. Des produits frais et de qualité.' :
                 user && profile?.role === 'consumer' ? 'Tous nos producteurs sont vérifiés. Qualité et fraîcheur garanties ou remboursées.' :
                 'Vendez au meilleur prix en supprimant les intermédiaires. Gardez 100% de votre marge.'}
              </p>
            </div>

            {/* Carte 2 - Adaptée selon le rôle */}
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {!user ? <Users className="h-8 w-8 text-green-600" /> :
                 user && profile?.role === 'consumer' ? <MapPin className="h-8 w-8 text-green-600" /> :
                 <Store className="h-8 w-8 text-green-600" />}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {!user ? 'Soutenez les producteurs' :
                 user && profile?.role === 'consumer' ? 'Produits locaux' :
                 'Vitrine en ligne'}
              </h3>
              <p className="text-gray-600">
                {!user ? 'Achetez directement aux agriculteurs locaux sans intermédiaires.' :
                 user && profile?.role === 'consumer' ? 'Trouvez des producteurs près de chez vous. Réduisez l\'empreinte carbone.' :
                 'Créez votre boutique en ligne en 5 minutes. Gérez vos horaires et disponibilités.'}
              </p>
            </div>

            {/* Carte 3 - Adaptée selon le rôle */}
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {!user ? <ShoppingBag className="h-8 w-8 text-green-600" /> :
                 user && profile?.role === 'consumer' ? <Truck className="h-8 w-8 text-green-600" /> :
                 <Package className="h-8 w-8 text-green-600" />}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {!user ? 'Simple et rapide' :
                 user && profile?.role === 'consumer' ? 'Livraison facile' :
                 'Logistique simplifiée'}
              </h3>
              <p className="text-gray-600">
                {!user ? 'Commandez en ligne, payez en toute sécurité, recevez chez vous.' :
                 user && profile?.role === 'consumer' ? 'Retrait à la ferme ou livraison à domicile. Choisissez ce qui vous convient.' :
                 'Gérez vos stocks, commandes et livraisons depuis une seule interface.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section producteur - Masquée pour les consommateurs connectés */}
      {!user || profile?.role !== 'consumer' ? (
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {!user ? 'Vous êtes producteur ?' : 'Votre espace producteur'}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {!user ? 'Rejoignez AgriConnect et vendez vos produits directement aux consommateurs. Augmentez vos revenus, gérez vos ventes facilement.' :
                     'Gérez votre exploitation en toute simplicité. Suivez vos ventes, vos stocks et votre clientèle.'}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <TrendingUp className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {!user ? 'Meilleurs prix pour vos produits' : 'Augmentez vos revenus de 30% en moyenne'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ShoppingBag className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {!user ? 'Gestion simple de vos annonces' : 'Gérez vos produits et commandes facilement'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Users className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {!user ? 'Accès direct aux consommateurs' : 'Construisez une relation directe avec vos clients'}
                      </span>
                    </li>
                  </ul>
                  <Link
                    to={!user ? "/register" : "/producer/dashboard"}
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {!user ? 'Créer mon compte producteur' : 'Accéder à mon tableau de bord'}
                  </Link>
                </div>
                <div className="bg-green-100 rounded-xl h-64 flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-green-600 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Section témoignages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ce que nos utilisateurs disent de nous
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Grâce à AgriConnect, je vends tous mes produits sans intermédiaire. Mes revenus ont augmenté de 40% !"
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marie D.</p>
                  <p className="text-sm text-gray-600">Producteur de légumes</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Les produits sont exceptionnels ! Je connais maintenant tous les producteurs autour de chez moi."
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">J</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jean P.</p>
                  <p className="text-sm text-gray-600">Consommateur</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "La plateforme est très simple d'utilisation. J'ai créé ma boutique en 10 minutes !"
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">P</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pierre L.</p>
                  <p className="text-sm text-gray-600">Éleveur de volailles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
