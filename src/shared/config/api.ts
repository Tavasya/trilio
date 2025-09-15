export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8080',
  TIMEOUT: 10000,
} as const;