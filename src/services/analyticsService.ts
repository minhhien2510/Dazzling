import { API_BASE } from './apiClient';
import type { TrackEventRequest } from '../types/adminAnalytics';
import { getAccessToken } from '../utils/tokenStorage';

export const analyticsService = {
  track: async (event: TrackEventRequest) => {
    try {
      const token = getAccessToken();
      await fetch(`${API_BASE}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(event),
      });
    } catch {
      // Tracking should never block the user flow.
    }
  },
};
