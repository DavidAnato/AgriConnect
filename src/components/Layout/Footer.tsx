import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './navigation-animations.css';

export default function Footer() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-white">AgriConnect</span>
            </div>
            <p className="text-sm">
              Connecter les producteurs locaux avec les consommateurs pour une agriculture durable et transparente.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className={`footer-link transition ${isActive('/') ? 'text-green-500 font-bold' : 'hover:text-green-500'}`}>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/catalog" className={`footer-link transition ${isActive('/catalog') ? 'text-green-500 font-bold' : 'hover:text-green-500'}`}>
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about" className={`footer-link transition ${isActive('/about') ? 'text-green-500 font-bold' : 'hover:text-green-500'}`}>
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/register" className={`footer-link transition ${isActive('/register') ? 'text-green-500 font-bold' : 'hover:text-green-500'}`}>
                  Devenir producteur
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className={`footer-link transition ${isActive('/terms') ? 'text-green-500 font-bold' : 'hover:text-green-500'}`}>
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`footer-link transition ${isActive('/privacy') ? 'text-green-500 font-bold' : 'hover:text-green-500'}`}>
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@agriconnect.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+229 01 66 60 58 19</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Bénin</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 AgriConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}