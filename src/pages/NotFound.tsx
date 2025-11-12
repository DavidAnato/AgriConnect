import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>
          Erreur 404
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
            Page introuvable
          </span>
        </h1>

        <p className="mt-4 text-gray-600">
          Oups, la page que vous cherchez n’existe pas ou a été déplacée.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Retour à l’accueil
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Voir le catalogue
          </Link>
        </div>

        <div className="mt-10 text-xs text-gray-400">
          Code: 404 – Ressource non trouvée
        </div>
      </div>
    </div>
  );
}

export default NotFound;