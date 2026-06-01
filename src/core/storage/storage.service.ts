import { ImageAsset } from '../../types';

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

export const storageService = {
  uploadImage: async (
    fileUrl: string,
    ownerId: string,
    ownerName: string,
    groupId: string,
    onProgress?: (progress: number) => void
  ): Promise<ImageAsset> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (onProgress) onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          // Simulate 10% error rate
          if (Math.random() < 0.1) {
            reject(new Error('Lỗi tải lên máy chủ. Vui lòng thử lại.'));
            return;
          }

          resolve({
            id: Math.random().toString(36).substr(2, 9),
            url: fileUrl,
            groupId,
            ownerId,
            ownerName,
            createdAt: Date.now(),
            reactions: [],
            commentsCount: 0,
            visibility: 'group',
            size: Math.floor(Math.random() * 1000000) + 500000,
          });
        }
      }, 150);
    });
  },
};
