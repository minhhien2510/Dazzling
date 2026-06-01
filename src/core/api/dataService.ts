import { PhotoboothStore, FeedItem } from '../../types';
import { mockStores, mockFeed } from '../../mocks/data';

export const dataService = {
  getStores: async (): Promise<PhotoboothStore[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStores), 800);
    });
  },
  getFeed: async (): Promise<FeedItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFeed), 800);
    });
  },
};
