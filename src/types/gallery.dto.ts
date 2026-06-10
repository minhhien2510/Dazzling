/**
 * Raw API response shapes from backend.
 * objectName is accepted from API but never exposed to UI — images load via presigned URL.
 */

export interface GalleryUploadDto {
  id: number;
  fileName: string;
  fileSize: number;
  imageUrl?: string | null;
  objectName?: string;
}

export interface GalleryItemDto {
  id: number;
  userId: number;
  sessionId: number | null;
  fileName: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  imageUrl?: string | null;
  objectName?: string;
}

export interface GalleryPageDto {
  content: GalleryItemDto[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface PresignedUrlDto {
  url: string;
  expiresIn: number;
}
