import { apiClient } from './apiClient';
import type {
  DailyMetric,
  FeedbackItem,
  FeedbackStats,
  FunnelStep,
  OverviewStats,
  PageResponse,
  SessionStats,
  StorageStats,
  TopFrame,
} from '../types/adminAnalytics';

export const adminDashboardService = {
  getOverview: () => apiClient.get<OverviewStats>('/api/admin/dashboard/overview').then((r) => r.data),
  getFunnel: () => apiClient.get<FunnelStep[]>('/api/admin/dashboard/funnel').then((r) => r.data),
  getPhotosByDay: () => apiClient.get<DailyMetric[]>('/api/admin/dashboard/photos-by-day').then((r) => r.data),
  getTopFrames: () => apiClient.get<TopFrame[]>('/api/admin/dashboard/top-frames').then((r) => r.data),
  getFeedbackStats: () => apiClient.get<FeedbackStats>('/api/admin/dashboard/feedback-stats').then((r) => r.data),
  getSessionStats: () => apiClient.get<SessionStats>('/api/admin/dashboard/session-stats').then((r) => r.data),
  getStorageStats: () => apiClient.get<StorageStats>('/api/admin/dashboard/storage-stats').then((r) => r.data),
  getFeedback: (rating?: number) =>
    apiClient.get<PageResponse<FeedbackItem>>('/api/feedback', { params: { rating } }).then((r) => r.data),
};
