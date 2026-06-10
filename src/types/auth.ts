export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  details?: unknown[];
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || body.error || 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}
