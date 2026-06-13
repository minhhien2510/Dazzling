export type AnalyticsEventType =
  | 'VISIT_HOME'
  | 'OPEN_CAMERA'
  | 'TAKE_PHOTO'
  | 'DOWNLOAD_PHOTO'
  | 'CREATE_SESSION'
  | 'COMPLETE_SESSION'
  | 'SUBMIT_FEEDBACK'
  | 'USE_FRAME';

export interface OverviewStats {
  activeUsers: number;
  photosGenerated: number;
  sessionsCreated: number;
  averageRating: number;
}

export interface FunnelStep {
  eventType: AnalyticsEventType;
  label: string;
  count: number;
  conversionRate: number;
}

export interface DailyMetric {
  date: string;
  count: number;
}

export interface TopFrame {
  frameId: string | null;
  frameName: string;
  usageCount: number;
  usageRate: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface FeedbackStats {
  averageRating: number;
  totalFeedback: number;
  distribution: RatingDistribution[];
}

export interface SessionStats {
  created: number;
  completed: number;
  canceled: number;
  averagePhotosPerSession: number;
}

export interface StorageStats {
  totalImages: number;
  totalBytes: number;
  averageBytesPerImage: number;
}

export interface TrackEventRequest {
  eventType: AnalyticsEventType;
  metadata?: Record<string, unknown>;
}

export interface FeedbackItem {
  id: number;
  userId: number | null;
  rating: number;
  content: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
