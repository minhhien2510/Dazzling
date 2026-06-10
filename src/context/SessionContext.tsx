import React, { createContext, useCallback, useContext, useState } from 'react';
import type { PhotoSession } from '../types/session';
import { sessionService } from '../services/sessionService';
import { getApiErrorMessage } from '../services/apiClient';

interface SessionContextType {
  currentSession: PhotoSession | null;
  isCreatingSession: boolean;
  createSession: (sessionName: string, layoutType: string) => Promise<PhotoSession>;
  clearCurrentSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<PhotoSession | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const createSession = useCallback(async (sessionName: string, layoutType: string) => {
    setIsCreatingSession(true);
    try {
      const session = await sessionService.create({ sessionName, layoutType });
      setCurrentSession(session);
      return session;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      setIsCreatingSession(false);
    }
  }, []);

  const clearCurrentSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{ currentSession, isCreatingSession, createSession, clearCurrentSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
