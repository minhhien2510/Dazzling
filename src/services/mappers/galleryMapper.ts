import type { GalleryItem, GalleryPageResponse, GalleryUploadResponse, PresignedUrlResponse } from '../../types/gallery';
import type { GalleryItemDto, GalleryPageDto, GalleryUploadDto, PresignedUrlDto } from '../../types/gallery.dto';

export function mapGalleryUpload(dto: GalleryUploadDto): GalleryUploadResponse {
  return {
    id: dto.id,
    fileName: dto.fileName,
    fileSize: dto.fileSize,
    imageUrl: dto.imageUrl ?? null,
  };
}

/** Maps list/detail DTO — objectName is stripped, never passed to UI */
export function mapGalleryItem(dto: GalleryItemDto): GalleryItem {
  return {
    id: dto.id,
    userId: dto.userId,
    sessionId: dto.sessionId,
    fileName: dto.fileName,
    fileSize: dto.fileSize,
    width: dto.width,
    height: dto.height,
    createdAt: dto.createdAt,
    imageUrl: dto.imageUrl ?? null,
  };
}

export function mapGalleryPage(dto: GalleryPageDto): GalleryPageResponse {
  return {
    content: dto.content.map(mapGalleryItem),
    totalPages: dto.totalPages,
    totalElements: dto.totalElements,
    number: dto.number,
    size: dto.size,
    pageable: dto.pageable,
  };
}

export function mapPresignedUrl(dto: PresignedUrlDto): PresignedUrlResponse {
  return {
    url: dto.url,
    expiresIn: dto.expiresIn,
  };
}
