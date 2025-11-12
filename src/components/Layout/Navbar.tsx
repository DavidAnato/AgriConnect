import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './navigation-animations.css';
import logoSrc from '../../media/AgriConnect logo.png';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('userData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const role = (user?.role || savedUser?.role) as 'producer' | 'consumer' | 'admin' | undefined;
  const displayName = useMemo(() => {
    const first = user?.first_name ?? savedUser?.first_name;
    const last = user?.last_name ?? savedUser?.last_name;
    const email = user?.email ?? savedUser?.email;
    const full = [first, last].filter(Boolean).join(' ').trim();
    return full || email || 'Mon compte';
  }, [user, savedUser]);

  const isActive = (path: string) => location.pathname === path;

  const handlelogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const cartItemsCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoSrc} alt="AgriConnect" className="h-20 w-20 object-contain" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`flex items-center space-x-1 transition nav-link ${isActive('/') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>
              <span>Accueil</span>
            </Link>
            <Link to="/catalog" className={`flex items-center space-x-1 transition nav-link ${isActive('/catalog') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>
              <span>Catalogue</span>
            </Link>
            <Link to="/about" className={`flex items-center space-x-1 transition nav-link ${isActive('/about') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>
              <span>À propos</span>
            </Link>
            <Link to="/contact" className={`flex items-center space-x-1 transition nav-link ${isActive('/contact') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>
              <span>Contact</span>
            </Link>
            
            {/* Liens spécifiques selon le rôle */}
            {user && role === 'producer' && (
              <Link to="/producer/dashboard" className={`flex items-center space-x-1 transition nav-link ${isActive('/producer/dashboard') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>
                <span>Mon Espace</span>
              </Link>
            )}
            {user && role === 'consumer' && (
              <>
                <Link to="/consumer/dashboard" className={`flex items-center space-x-1 transition nav-link ${isActive('/consumer/orders') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>
                  <span>Mon Espace</span>
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && role === 'consumer' && (
              <Link to="/cart" className="relative text-gray-700 hover:text-green-600 transition">
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={'/profile'}
                  className={`flex items-center space-x-1 transition nav-link text-gray-700 hover:text-green-600`}
                > 
                  <User className="h-6 w-6" />
                  <span className="text-sm">{displayName}</span>
                </Link>
                <button
                  onClick={handlelogout}
                  className="text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`transition nav-link ${isActive('/login') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'} font-medium`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className={`transition nav-link ${isActive('/register') ? 'bg-green-700 font-bold' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg`}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              className={`block transition nav-link ${isActive('/') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/catalog"
              className={`block transition nav-link ${isActive('/catalog') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Catalogue
            </Link>
            <Link
              to="/about"
              className={`block transition nav-link ${isActive('/about') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            {user ? (
              <>
                <Link
                  to={
                    user?.role === 'producer'
                      ? '/producer/dashboard'
                      : user?.role === 'admin'
                      ? '/admin/dashboard'
                      : '/consumer/dashboard'
                  }
                  className="block text-gray-700 hover:text-green-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon compte
                </Link>
                {role === 'consumer' && (
                  <Link
                    to="/cart"
                    className="block text-gray-700 hover:text-green-600 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panier ({cartItemsCount})
                  </Link>
                )}
                <button
                  onClick={() => {
                    handlelogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-green-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}