/**
 * Global API Configuration for ExamPrep AI
 * Automatically resolves development vs. production backend URLs.
 * Never defaults to localhost in production.
 */

export const getApiBaseUrl = (): string => {
  // 1. Explicitly configured VITE_API_BASE_URL (set in Vercel or local .env)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // 2. Development mode fallback (Vite dev server)
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }

  // 3. Production warning: never silently fallback to localhost in production
  console.warn(
    '[ExamPrep API] VITE_API_BASE_URL is not set in production. Please set VITE_API_BASE_URL in your Vercel Project Settings -> Environment Variables to your Render backend URL.'
  );
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Returns a fully qualified endpoint URL.
 * Throws a clear descriptive error in production if the backend URL is unconfigured.
 */
export const getEndpointUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!base) {
    if (import.meta.env.PROD) {
      throw new Error(
        'Backend API URL is not configured. Please set the VITE_API_BASE_URL environment variable in your Vercel project settings to your deployed Render backend URL (e.g., https://your-backend.onrender.com).'
      );
    }
    return `http://localhost:8080${normalizedPath}`;
  }

  return `${base}${normalizedPath}`;
};
