import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../../../services/feedbackService';
import type { CreateFeedbackRequest } from '../../../types/feedback';

export const feedbackKeys = {
  my: ['feedback', 'my'] as const,
};

export function useMyFeedbacks() {
  return useQuery({ queryKey: feedbackKeys.my, queryFn: feedbackService.getMyFeedbacks });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeedbackRequest) => feedbackService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.my });
    },
  });
}
