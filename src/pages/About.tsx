import { Leaf, Users, ShoppingBag, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">À propos d'AgriConnect</h1>
          <p className="text-xl text-gray-600">
            Réinventer le lien entre producteurs et consommateurs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            AgriConnect est né d'une vision simple mais puissante : connecter directement les
            agriculteurs locaux avec les consommateurs, restaurants et commerçants. Notre plateforme
            élimine les intermédiaires pour garantir des prix justes aux producteurs et des produits
            frais de qualité aux acheteurs.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nous croyons en une agriculture durable, transparente et accessible à tous. Chaque
            transaction sur AgriConnect soutient directement nos agriculteurs locaux et contribue
            au développement de nos communautés rurales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pour les Producteurs</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Vendez directement sans intermédiaires</li>
              <li>• Fixez vos propres prix</li>
              <li>• Gérez facilement vos stocks</li>
              <li>• Augmentez vos revenus</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pour les Consommateurs</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Produits frais du champ à votre table</li>
              <li>• Connaissez vos producteurs</li>
              <li>• Meilleurs prix garantis</li>
              <li>• Livraison locale disponible</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-600 text-white rounded-xl shadow-md p-8 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Transparence</h3>
              <p className="text-green-100 text-sm">
                Chaque produit vient avec des informations claires sur son origine
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Qualité</h3>
              <p className="text-green-100 text-sm">
                Nous encourageons les meilleures pratiques agricoles
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Communauté</h3>
              <p className="text-green-100 text-sm">
                Nous renforçons les liens entre producteurs et consommateurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
