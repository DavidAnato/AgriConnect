// Read API base URL from Vite env, fallback to local in development
// Ensures no trailing slash to keep URL concatenation consistent
export const API_URL = (() => {
  const raw = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000';
  return raw.replace(/\/+$/, '');
})();