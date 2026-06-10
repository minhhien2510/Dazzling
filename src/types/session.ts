export interface CreateSessionRequest {
  sessionName: string;
  layoutType: string;
}

export interface PhotoSession {
  id: number;
  userId: number;
  sessionName: string;
  layoutType: string;
  createdAt?: string;
}
