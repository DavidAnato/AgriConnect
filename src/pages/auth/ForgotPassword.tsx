import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import logoSrc from '../../media/AgriConnect logo.png';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!emailOrPhone) {
      setError('Veuillez entrer votre email ou numéro de téléphone.');
      return;
    }

    setLoading(true);
    try {
      const message = await requestPasswordReset({ email_or_phone: emailOrPhone });
      setSuccess(message || 'Code OTP envoyé avec succès. Vérifiez votre email ou SMS.');
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="AgriConnect" className="h-20 w-20" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Mot de passe oublié</h2>
          <p className="text-gray-600 mt-2">Entrez votre email ou numéro de téléphone</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Email ou numéro de téléphone
            </label>
            <input
              id="emailOrPhone"
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="votre@email.com ou +225 XX XX XX XX XX"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi...' : 'Envoyer le code'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}