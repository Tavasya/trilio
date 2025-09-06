export const API_CONFIG = {
  BASE_URL: import.meta.env.API_BASE_URL || 'http://0.0.0.0:8000',
  TIMEOUT: 10000,
} as const;