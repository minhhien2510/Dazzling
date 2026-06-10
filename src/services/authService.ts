import type {
  AuthTokens,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../types/auth';
import { apiClient, publicClient } from './apiClient';

export function getAvatarUrl(user: AuthUser): string {
  if (user.avatarUrl) return user.avatarUrl;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`;
}

export const authService = {
  register: (data: RegisterRequest) =>
    publicClient.post<AuthTokens>('/api/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    publicClient.post<AuthTokens>('/api/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    publicClient.post<AuthTokens>('/api/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: (refreshToken: string) =>
    publicClient
      .post<{ success: boolean; message: string }>('/api/auth/logout', { refreshToken })
      .then((r) => r.data),

  /** Current user profile — GET /me only (token-info & /api/users/me removed) */
  getMe: () => apiClient.get<AuthUser>('/api/users/me').then((r) => r.data),
};
