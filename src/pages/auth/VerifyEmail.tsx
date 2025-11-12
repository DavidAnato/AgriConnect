import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import logoSrc from '../../media/AgriConnect logo.png';

export default function VerifyEmail() {
  const { verifyEmail, resendActivation } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp) {
      setError('Veuillez renseigner votre email et le code OTP.');
      return;
    }
    setLoading(true);
    try {
      const msg = await verifyEmail({ email, otp_code: otp });
      setSuccess(msg || 'Email vérifié avec succès. Vous pouvez vous connecter.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Échec de vérification. Vérifiez le code et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    if (!email) {
      setError("Renseignez d'abord votre email.");
      return;
    }
    setResending(true);
    try {
      const msg = await resendActivation({ email });
      setSuccess(msg || "Code OTP renvoyé. Vérifiez votre boîte mail.");
    } catch (err) {
      setError("Impossible d'envoyer le code. Réessayez plus tard.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="AgriConnect" className="h-20 w-20" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Vérification d'email</h2>
          <p className="text-gray-600 mt-2">Entrez votre email et le code OTP reçu</p>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Code OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="123456"
            />
            <div className="mt-2 text-right">
              <button type="button" onClick={handleResend} className="text-sm text-green-600 hover:text-green-700 inline-flex items-center" disabled={resending}>
                <RefreshCcw className="h-4 w-4 mr-1" /> {resending ? 'Renvoi...' : 'Renvoyer le lien d\'activation'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Vérification...' : 'Vérifier mon email'}
          </button>
        </form>
      </div>
    </div>
  );
}