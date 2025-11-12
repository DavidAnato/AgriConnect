import { useAuth } from "../../contexts/AuthContext";

export default function ConsumerDashboard() {
  const { user } = useAuth();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Catalogue</h3>
            <p className="text-gray-600 mb-4">Parcourez nos produits locaux</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Voir le catalogue
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mes Commandes</h3>
            <p className="text-gray-600 mb-4">Suivez vos commandes</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Voir mes commandes
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Favoris</h3>
            <p className="text-gray-600 mb-4">Vos produits préférés</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Voir les favoris
            </button>
          </div>
        </div>

        {/* Recommandations & Infos compte */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommandés pour vous</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-24 bg-green-50 rounded mb-3" />
                  <p className="font-semibold text-gray-900">Produit #{i}</p>
                  <p className="text-sm text-gray-600">Producteur local</p>
                  <button className="mt-3 w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors">Voir</button>
                </div>
              ))}
            </div>
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