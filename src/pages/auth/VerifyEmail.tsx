import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import logoSrc from '../../media/AgriConnect logo.png';

export default function VerifyEmail() {
  const { verifyEmail, resendActivation } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const emailParam = searchParams.get('email') ?? '';
    const otpParam = searchParams.get('otp_code') ?? '';
    setEmail(emailParam);
    if (otpParam) setOtp(otpParam);
  }, [searchParams]);

  // Auto-verify if both email and otp_code are present
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const otpParam = searchParams.get('otp_code');
    if (emailParam && otpParam && !autoVerifying) {
      setAutoVerifying(true);
      handleAutoVerify(emailParam, otpParam);
    }
  }, [searchParams, autoVerifying]);

  const handleAutoVerify = async (emailParam: string, otpParam: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const msg = await verifyEmail({ email: emailParam, otp_code: otpParam });
      setSuccess(
        typeof msg === 'string' ? msg : 'Email vérifié avec succès. Vous pouvez vous connecter.'
      );
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(
        typeof err?.message === 'string'
          ? err.message
          : 'Échec de vérification. Vérifiez le code et réessayez.'
      );
    } finally {
      setLoading(false);
    }
  };

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
      setSuccess(
        typeof msg === 'string' ? msg : 'Email vérifié avec succès. Vous pouvez vous connecter.'
      );
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(
        typeof err?.message === 'string'
          ? err.message
          : 'Échec de vérification. Vérifiez le code et réessayez.'
      );
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
      setSuccess(
        typeof msg === 'string' ? msg : 'Code OTP renvoyé. Vérifiez votre boîte mail.'
      );
    } catch (err: any) {
      setError(
        typeof err?.message === 'string'
          ? err.message
          : "Impossible d'envoyer le code. Réessayez plus tard."
      );
    } finally {
      setResending(false);
    }
  };

  // 6-digit OTP input
  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = otp.split('');
    newOtp[idx] = val;
    const nextOtp = newOtp.join('');
    setOtp(nextOtp);
    // Auto-focus next input
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      prev?.focus();
    }
  };

  const renderOtpInputs = () => (
    <div className="flex justify-between gap-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          maxLength={1}
          value={otp[i] || ''}
          onChange={(e) => handleOtpChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );

  // If auto-verifying, show a spinner
  if (autoVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="AgriConnect" className="w-24" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vérification d'email</h2>
          <p className="text-gray-600">Vérification automatique en cours...</p>
        </div>
      </div>
    );
  }

  // If URL contains both email and otp_code, do not show the form
  const urlHasBoth = searchParams.get('email') && searchParams.get('otp_code');

  if (urlHasBoth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="AgriConnect" className="w-24" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vérification d'email</h2>
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
        </div>
      </div>
    );
  }

  // Otherwise, show the classic form
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="AgriConnect" className="w-24" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Code OTP</label>
            {renderOtpInputs()}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-green-600 hover:text-green-700 inline-flex items-center"
                disabled={resending}
              >
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