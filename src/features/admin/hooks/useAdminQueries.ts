import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, type AnalyticsDateRange, type FeedbackListParams } from '../../../services/adminService';
import type { FeedbackStatus } from '../../../types/admin';

export const adminKeys = {
  dashboard: ['admin', 'dashboard'] as const,
  users: (range: AnalyticsDateRange) => ['admin', 'stats', 'users', range] as const,
  sessions: (range: AnalyticsDateRange) => ['admin', 'stats', 'sessions', range] as const,
  photos: (range: AnalyticsDateRange) => ['admin', 'stats', 'photos', range] as const,
  feedbacks: (params: FeedbackListParams) => ['admin', 'feedbacks', params] as const,
  feedbackDetail: (id?: number) => ['admin', 'feedbacks', id] as const,
};

export function useDashboard() {
  return useQuery({ queryKey: adminKeys.dashboard, queryFn: adminService.getDashboard });
}

export function useUserStats(range: AnalyticsDateRange) {
  return useQuery({ queryKey: adminKeys.users(range), queryFn: () => adminService.getUserStats(range) });
}

export function useSessionStats(range: AnalyticsDateRange) {
  return useQuery({ queryKey: adminKeys.sessions(range), queryFn: () => adminService.getSessionStats(range) });
}

export function usePhotoStats(range: AnalyticsDateRange) {
  return useQuery({ queryKey: adminKeys.photos(range), queryFn: () => adminService.getPhotoStats(range) });
}

export function useFeedbacks(params: FeedbackListParams) {
  return useQuery({ queryKey: adminKeys.feedbacks(params), queryFn: () => adminService.getFeedbacks(params) });
}

export function useFeedbackDetail(id?: number) {
  return useQuery({
    queryKey: adminKeys.feedbackDetail(id),
    queryFn: () => adminService.getFeedbackDetail(id!),
    enabled: typeof id === 'number',
  });
}

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: FeedbackStatus }) =>
      adminService.updateFeedbackStatus(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedbacks'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.feedbackDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useReplyFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: number; message: string }) =>
      adminService.replyFeedback(id, { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedbacks'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.feedbackDetail(variables.id) });
    },
  });
}
