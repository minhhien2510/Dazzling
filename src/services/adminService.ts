import { apiClient } from './apiClient';
import type {
  AdminDashboardStats,
  AdminFeedbackDetail,
  AdminFeedbackListItem,
  AdminStatPoint,
  FeedbackStatus,
  PageResponse,
  ReplyFeedbackRequest,
  UpdateFeedbackStatusRequest,
} from '../types/admin';

export interface AnalyticsDateRange {
  from?: string;
  to?: string;
}

export interface FeedbackListParams {
  status?: FeedbackStatus | 'ALL';
  page?: number;
  size?: number;
}

export const adminService = {
  getDashboard: () => apiClient.get<AdminDashboardStats>('/api/admin/dashboard').then((r) => r.data),

  getUserStats: (params?: AnalyticsDateRange) =>
    apiClient.get<AdminStatPoint[]>('/api/admin/stats/users', { params }).then((r) => r.data),

  getSessionStats: (params?: AnalyticsDateRange) =>
    apiClient.get<AdminStatPoint[]>('/api/admin/stats/sessions', { params }).then((r) => r.data),

  getPhotoStats: (params?: AnalyticsDateRange) =>
    apiClient.get<AdminStatPoint[]>('/api/admin/stats/photos', { params }).then((r) => r.data),

  getFeedbacks: ({ status, page = 0, size = 10 }: FeedbackListParams = {}) =>
    apiClient
      .get<PageResponse<AdminFeedbackListItem>>('/api/admin/feedbacks', {
        params: {
          status: status && status !== 'ALL' ? status : undefined,
          page,
          size,
        },
      })
      .then((r) => r.data),

  getFeedbackDetail: (id: number) =>
    apiClient.get<AdminFeedbackDetail>(`/api/admin/feedbacks/${id}`).then((r) => r.data),

  updateFeedbackStatus: (id: number, data: UpdateFeedbackStatusRequest) =>
    apiClient.put<AdminFeedbackDetail>(`/api/admin/feedbacks/${id}/status`, data).then((r) => r.data),

  replyFeedback: (id: number, data: ReplyFeedbackRequest) =>
    apiClient.post<AdminFeedbackDetail>(`/api/admin/feedbacks/${id}/reply`, data).then((r) => r.data),
};
