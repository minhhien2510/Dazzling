import type { CreateSessionRequest, PhotoSession } from '../types/session';
import { apiClient } from './apiClient';

export const sessionService = {
  create: (data: CreateSessionRequest) =>
    apiClient.post<PhotoSession>('/api/sessions', data).then((r) => r.data),

  getAll: () => apiClient.get<PhotoSession[]>('/api/sessions').then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<PhotoSession>(`/api/sessions/${id}`).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/api/sessions/${id}`),
};
