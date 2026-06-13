import { apiClient } from './apiClient';
import type { CreateFeedbackRequest, MyFeedbackItem } from '../types/feedback';

export const feedbackService = {
  create: (data: CreateFeedbackRequest) =>
    apiClient.post<MyFeedbackItem>('/api/feedback', data).then((r) => r.data),

  getMyFeedbacks: () => apiClient.get<MyFeedbackItem[]>('/api/feedback/my').then((r) => r.data),
};
