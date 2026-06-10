import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthTokens } from '../types/auth';
import { ApiError, type ApiErrorBody } from '../types/auth';
import {
  clearStoredTokens,
  dispatchTokenRefreshed,
  getAccessToken,
  getStoredTokens,
  storeTokens,
} from '../utils/tokenStorage';

export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export const publicClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
}

function toApiError(error: AxiosError<ApiErrorBody>): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data ?? { message: error.message };
  return new ApiError(status, body);
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(toApiError(error));
    }

    const isAuthEndpoint = originalRequest.url?.includes('/api/auth/');
    if (isAuthEndpoint) {
      return Promise.reject(toApiError(error));
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      clearStoredTokens();
      processQueue(error, null);
      isRefreshing = false;
      return Promise.reject(toApiError(error));
    }

    try {
      const { data } = await publicClient.post<AuthTokens>('/api/auth/refresh', { refreshToken });
      storeTokens(data);
      dispatchTokenRefreshed(data);
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearStoredTokens();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.message || body?.error || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
