import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
import logoSrc from '../../media/AgriConnect logo.png';

export default function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [farmDescription, setFarmDescription] = useState('');
  const [role, setRole] = useState<'consumer' | 'producer'>('consumer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const { signUp, checkEmailExists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmail = async () => {
      if (email && email.includes('@')) {
        setCheckingEmail(true);
        try {
          const exists = await checkEmailExists({ email });
          setEmailExists(exists.exists);
        } catch (err) {
          setEmailExists(null);
        } finally {
          setCheckingEmail(false);
        }
      } else {
        setEmailExists(null);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email, checkEmailExists]);

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!firstName || !lastName) {
        setError('Renseignez votre nom et prénom.');
        return;
      }
      if (!email || !email.includes('@')) {
        setError('Renseignez un email valide.');
        return;
      }
      if (emailExists === true) {
        setError('Cet email est déjà utilisé.');
        return;
      }
      setStep(role === 'producer' ? 2 : 3);
    } else if (step === 2) {
      // Étape producteur (optionnelle) – pas de validations strictes
      setStep(3);
    }
  };

  const prevStep = () => {
    setError('');
    if (step === 2) setStep(1);
    else if (step === 3) setStep(role === 'producer' ? 2 : 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step !== 3) {
      nextStep();
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (emailExists === true) {
      setError('Cet email est déjà utilisé.');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        password,
        farm_name: role === 'producer' ? farmName : undefined,
        farm_address: role === 'producer' ? address : undefined,
        farm_description: role === 'producer' ? farmDescription : undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/verify-email?email=${email}`);
      }, 1500);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="AgriConnect" className="w-24" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          <p className="text-gray-600 mt-2">Créez votre compte AgriConnect</p>
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
            <span>Compte créé avec succès ! Vérifiez votre email...</span>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1,2,3].map((s) => (
            <div key={s} className={`h-2 w-24 rounded-full ${step >= s ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de compte
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('consumer')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                      role === 'consumer'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Consommateur
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('producer')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                      role === 'producer'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Producteur
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent ${
                      emailExists === true
                        ? 'border-red-300 bg-red-50'
                        : emailExists === false
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {checkingEmail && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  {emailExists === true && (
                    <div className="absolute right-3 top-2.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                  {emailExists === false && (
                    <div className="absolute right-3 top-2.5 text-green-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {emailExists === true && (
                  <p className="mt-1 text-sm text-red-600">Cet email est déjà utilisé</p>
                )}
                {emailExists === false && email.includes('@') && (
                  <p className="mt-1 text-sm text-green-600">Email disponible</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone (optionnel)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="+229 XX XX XX XX XX"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={nextStep} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                  Suivant
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {role === 'producer' ? (
                <>
                  <div>
                    <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la ferme
                    </label>
                    <input
                      id="farmName"
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Ferme Bio"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse de la ferme
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Village XYZ"
                    />
                  </div>

                  <div>
                    <label htmlFor="farmDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Description de la ferme
                    </label>
                    <textarea
                      id="farmDescription"
                      value={farmDescription}
                      onChange={(e) => setFarmDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Production biologique de légumes"
                    />
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg">
                  Cette étape est réservée aux producteurs. Cliquez sur Suivant.
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 bg-white text-gray-800 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Précédent
                </button>
                <button type="button" onClick={nextStep} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                  Suivant
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 bg-white text-gray-800 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Précédent
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Inscription...' : "S'inscrire"}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
