export interface AdminDashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  newUsersToday: number;
  totalSessions: number;
  sessionsToday: number;
  totalPhotos: number;
  photosToday: number;
  storageUsedMB: number;
  openFeedbacks: number;
}

export interface AdminStatPoint {
  date: string;
  count: number;
}

export type FeedbackStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type FeedbackType = 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'OTHER';

export interface FeedbackReply {
  id: number;
  message: string;
  userId?: number | null;
  adminId?: number | null;
  createdAt: string;
}

export interface AdminFeedbackListItem {
  id: number;
  title: string;
  type: FeedbackType;
  status: FeedbackStatus;
  userId: number;
  createdAt: string;
}

export interface AdminFeedbackDetail extends AdminFeedbackListItem {
  content: string;
  replies: FeedbackReply[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UpdateFeedbackStatusRequest {
  status: FeedbackStatus;
}

export interface ReplyFeedbackRequest {
  message: string;
}
