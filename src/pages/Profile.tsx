import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { User, Mail, Phone, MapPin, Edit2, Save, X, LogOut ,ShieldCheck, HelpCircle, Lock, Key } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    farm_name: user?.farm_name || '',
    farm_address: user?.farm_address || '',
    farm_description: user?.farm_description || '',
  });
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      farm_name: user?.farm_name || '',
      farm_address: user?.farm_address || '',
      farm_description: user?.farm_description || '',
    });
    setIsEditing(false);
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'producer':
        return 'Producteur';
      case 'consumer':
        return 'Consommateur';
      case 'admin':
        return 'Administrateur';
      default:
        return '';
    }
  };

  if (!user) {
    return null;
  }

  return (
      <div className="max-w-4xl mx-auto my-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Prénom"
                      />
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Nom"
                      />
                    </div>
                  ) : (
                    <p className="font-medium">
                      {user.first_name || user.last_name 
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : 'Non renseigné'
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Numéro de téléphone"
                    />
                  ) : (
                    <p className="font-medium">{user.phone_number || 'Non renseigné'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-semibold">
                    {getRoleLabel()[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rôle</p>
                  <p className="font-medium">{getRoleLabel()}</p>
                </div>
              </div>
            </div>

            {/* Informations de la ferme (pour les producteurs) */}
            {user.role === 'producer' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de la ferme</h2>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nom de la ferme</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.farm_name}
                        onChange={(e) => setFormData({...formData, farm_name: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Nom de votre ferme"
                      />
                    ) : (
                      <p className="font-medium">{user.farm_name || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse de la ferme</p>
                    {isEditing ? (
                      <textarea
                        value={formData.farm_address}
                        onChange={(e) => setFormData({...formData, farm_address: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        placeholder="Adresse de votre ferme"
                        rows={2}
                      />
                    ) : (
                      <p className="font-medium">{user.farm_address || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description de la ferme</p>
                  {isEditing ? (
                    <textarea
                      value={formData.farm_description}
                      onChange={(e) => setFormData({...formData, farm_description: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      placeholder="Décrivez votre ferme et vos produits"
                      rows={3}
                    />
                  ) : (
                    <p className="font-medium">{user.farm_description || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Annuler</span>
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Sauvegarder</span>
              </button>
            </div>
          )}
        </div>

        {/* Statistiques et autres informations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du compte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Date d'inscription</p>
              <p className="font-medium">
                {user.date_joined 
                  ? new Date(user.date_joined).toLocaleDateString('fr-FR')
                  : 'Non disponible'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut du compte</p>
              <p className="font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Actif' : 'Inactif'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email vérifié</p>
              <p className="font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.verified_email ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.verified_email ? 'Vérifié' : 'Non vérifié'}
                </span>
              </p>
            </div>
            {user.google_id && (
              <div>
                <p className="text-sm text-gray-600">Compte Google</p>
                <p className="font-medium text-blue-600">Connecté via Google</p>
              </div>
            )}
          </div>
        </div>

        {/* Liens vers les pages d'authentification */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions d’authentification</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link to="/verify-email" className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
              <ShieldCheck className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Vérifier l’email</span>
            </Link>
            <Link to="/forgot-password" className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
              <HelpCircle className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Mot de passe oublié</span>
            </Link>
            <Link to="/reset-password" className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
              <Key className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Réinitialiser le mot de passe</span>
            </Link>
            <Link to="/change-password" className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
              <Lock className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Changer le mot de passe</span>
            </Link>
            <Link to="/set-password" className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
              <Key className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Définir le mot de passe</span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
  );
}