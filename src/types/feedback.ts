import type { FeedbackReply, FeedbackStatus, FeedbackType } from './admin';

export interface CreateFeedbackRequest {
  title: string;
  content: string;
  type: FeedbackType;
}

export interface MyFeedbackItem {
  id: number;
  title: string;
  content: string;
  type: FeedbackType;
  status: FeedbackStatus;
  createdAt: string;
  replies: FeedbackReply[];
}
