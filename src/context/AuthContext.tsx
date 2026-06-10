import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';
import {
  AUTH_TOKEN_REFRESHED_EVENT,
  clearStoredTokens,
  getStoredTokens,
  storeTokens,
} from '../utils/tokenStorage';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  loginWithCredentials: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const applySession = useCallback((token: string, profile: AuthUser) => {
    setAccessToken(token);
    setUser(profile);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    clearStoredTokens();
  }, []);

  const establishSession = useCallback(async (tokens: { accessToken: string; refreshToken: string }) => {
    storeTokens({ ...tokens, tokenType: 'Bearer' });
    setAccessToken(tokens.accessToken);
    const profile = await authService.getMe();
    setUser(profile);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await authService.getMe();
    setUser(profile);
  }, []);

  useEffect(() => {
    const onTokenRefreshed = (event: Event) => {
      const detail = (event as CustomEvent<{ accessToken: string }>).detail;
      setAccessToken(detail.accessToken);
    };
    window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, onTokenRefreshed);
    return () => window.removeEventListener(AUTH_TOKEN_REFRESHED_EVENT, onTokenRefreshed);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const { accessToken: storedAccess, refreshToken: storedRefresh } = getStoredTokens();
      if (!storedAccess) {
        setIsInitializing(false);
        return;
      }

      setAccessToken(storedAccess);
      try {
        const profile = await authService.getMe();
        setUser(profile);
      } catch {
        if (!storedRefresh) {
          clearSession();
          setIsInitializing(false);
          return;
        }

        try {
          const tokens = await authService.refresh(storedRefresh);
          await establishSession(tokens);
        } catch {
          clearSession();
        }
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, [clearSession, establishSession]);

  const loginWithCredentials = useCallback(async (data: LoginRequest) => {
    const tokens = await authService.login(data);
    await establishSession(tokens);
  }, [establishSession]);

  const register = useCallback(async (data: RegisterRequest) => {
    const tokens = await authService.register(data);
    await establishSession(tokens);
  }, [establishSession]);

  const logout = useCallback(async () => {
    const { refreshToken } = getStoredTokens();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Token may already be revoked; still clear local session.
      }
    }
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isInitializing,
        loginWithCredentials,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
