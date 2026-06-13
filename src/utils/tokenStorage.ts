import type { AuthTokens } from '../types/auth';

export const TOKEN_STORAGE_KEY = 'dazzling_access_token';
export const REFRESH_STORAGE_KEY = 'dazzling_refresh_token';
export const LEGACY_TOKEN_STORAGE_KEY = 'token';

export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: localStorage.getItem(TOKEN_STORAGE_KEY),
    refreshToken: localStorage.getItem(REFRESH_STORAGE_KEY),
  };
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
}

export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, tokens.accessToken);
  localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refreshToken);
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_STORAGE_KEY);
}

export const AUTH_TOKEN_REFRESHED_EVENT = 'auth:token-refreshed';

export function dispatchTokenRefreshed(tokens: AuthTokens): void {
  window.dispatchEvent(new CustomEvent(AUTH_TOKEN_REFRESHED_EVENT, { detail: tokens }));
}
