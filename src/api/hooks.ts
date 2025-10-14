import type { Hook, HookCategory } from '../types/hooks';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper to get auth token from Clerk
async function getAuthToken(): Promise<string> {
  // TODO: Implement Clerk auth token retrieval
  // For now, return empty string
  return '';
}

// Get all hook categories
export async function getHookCategories(): Promise<HookCategory[]> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE}/api/hooks/categories`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const data = await response.json();
  return data.categories.map((cat: any) => ({
    id: cat.category_type,
    name: cat.category
      .replace(/^\d+\s+LinkedIn\s+/i, '')
      .replace(/\s+hook\s+templates$/i, '')
      .replace(/^["']|["']$/g, ''), // Remove quotes from start/end
    count: cat.count,
    category_type: cat.category_type,
  }));
}

// Get all hooks with optional category filter
export async function getAllHooks(
  categoryType?: string,
  limit: number = 200,
  offset: number = 0
): Promise<{ hooks: Hook[]; total: number; hasMore: boolean }> {
  const token = await getAuthToken();
  const url = categoryType
    ? `${API_BASE}/api/hooks?category_type=${encodeURIComponent(categoryType)}&limit=${limit}&offset=${offset}`
    : `${API_BASE}/api/hooks?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hooks: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    hooks: data.hooks,
    total: data.total,
    hasMore: data.has_more,
  };
}

// Get hooks by category with pagination (wrapper for backwards compatibility)
export async function getHooksByCategory(
  categoryType: string,
  limit: number = 200,
  offset: number = 0
): Promise<{ hooks: Hook[]; total: number; hasMore: boolean }> {
  return getAllHooks(categoryType, limit, offset);
}

// Get single hook by ID
export async function getHook(hookId: number): Promise<Hook> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE}/api/hooks/${hookId}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hook: ${response.statusText}`);
  }

  const data = await response.json();
  return data.hook;
}
