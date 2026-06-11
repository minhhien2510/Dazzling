import type { GalleryItem, GalleryPageResponse, GalleryUploadResponse, PresignedUrlResponse } from '../types/gallery';
import type { GalleryItemDto, GalleryPageDto, GalleryUploadDto, PresignedUrlDto } from '../types/gallery.dto';
import { apiClient } from './apiClient';
import { mapGalleryItem, mapGalleryPage, mapGalleryUpload, mapPresignedUrl } from './mappers/galleryMapper';

export const galleryService = {
  upload: (file: File, sessionId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (sessionId != null) {
      formData.append('sessionId', String(sessionId));
    }
    return apiClient
      .post<GalleryUploadDto>('/api/gallery/upload', formData)
      .then((r) => mapGalleryUpload(r.data));
  },

  getPage: (page = 0, size = 20) =>
    apiClient
      .get<GalleryPageDto>('/api/gallery', { params: { page, size } })
      .then((r) => mapGalleryPage(r.data)),

  getById: (id: number) =>
    apiClient
      .get<GalleryItemDto>(`/api/gallery/${id}`)
      .then((r) => mapGalleryItem(r.data)),

  getPresignedUrl: (id: number) =>
    apiClient
      .get<PresignedUrlDto>(`/api/gallery/${id}/presigned-url`)
      .then((r) => mapPresignedUrl(r.data)),

  delete: (id: number) => apiClient.delete(`/api/gallery/${id}`),
};

export type { GalleryItem, GalleryPageResponse, GalleryUploadResponse, PresignedUrlResponse };
