export interface GalleryUploadResponse {
  id: number;
  fileName: string;
  fileSize: number;
  imageUrl?: string | null;
}

export interface GalleryItem {
  id: number;
  userId: number;
  sessionId: number | null;
  fileName: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  imageUrl?: string | null;
}

export interface PresignedUrlResponse {
  url: string;
  expiresIn: number;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
}

export interface GalleryPageResponse {
  content: GalleryItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  pageable?: Pageable;
}
