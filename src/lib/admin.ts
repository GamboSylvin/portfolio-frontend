export type AdminUserSession = {
  id: number;
  email: string;
  name: string;
};

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function readStoredUser(): AdminUserSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminUserSession;
  } catch {
    return null;
  }
}

export function saveAuthSession(token: string, user: AdminUserSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function authFetch<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const token = readStoredToken();
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error((payload as { error?: string }).error || 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
