import React, { createContext, useCallback, useContext, useState } from 'react';
import type { GalleryItem } from '../types/gallery';
import { galleryService } from '../services/galleryService';
import { getApiErrorMessage } from '../services/apiClient';

interface GalleryContextType {
  items: GalleryItem[];
  page: number;
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  loadGallery: (page?: number) => Promise<void>;
  uploadImage: (file: File, sessionId?: number) => Promise<GalleryItem | null>;
  deleteItem: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

const PAGE_SIZE = 20;

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGallery = useCallback(async (targetPage = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await galleryService.getPage(targetPage, PAGE_SIZE);
      setItems(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File, sessionId?: number) => {
    setIsUploading(true);
    setError(null);
    try {
      const uploaded = await galleryService.upload(file, sessionId);
      const detail = await galleryService.getById(uploaded.id);
      setItems((prev) => [detail, ...prev.filter((i) => i.id !== detail.id)]);
      setTotalElements((prev) => prev + 1);
      return detail;
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: number) => {
    setError(null);
    try {
      await galleryService.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotalElements((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadGallery(page);
  }, [loadGallery, page]);

  return (
    <GalleryContext.Provider
      value={{
        items,
        page,
        totalPages,
        totalElements,
        isLoading,
        isUploading,
        error,
        loadGallery,
        uploadImage,
        deleteItem,
        refresh,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
