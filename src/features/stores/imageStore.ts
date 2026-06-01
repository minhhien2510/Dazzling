import { create } from 'zustand';
import { ImageAsset, Comment, Reaction } from '../../types';

interface ImageState {
  images: ImageAsset[];
  comments: Record<string, Comment[]>;
  addImage: (image: ImageAsset) => void;
  addComment: (imageId: string, comment: Comment) => void;
  addReaction: (imageId: string, reaction: Reaction) => void;
  updateImage: (imageId: string, updatedUrl: string) => void;
  setImages: (images: ImageAsset[]) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  images: [],
  comments: {},
  addImage: (image) => set((state) => ({ images: [image, ...state.images] })),
  setImages: (images) => set({ images }),
  updateImage: (imageId, updatedUrl) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, url: updatedUrl } : img
      ),
    })),
  addComment: (imageId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [imageId]: [...(state.comments[imageId] || []), comment],
      },
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, commentsCount: img.commentsCount + 1 } : img
      ),
    })),
  addReaction: (imageId, reaction) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId
          ? {
              ...img,
              reactions: img.reactions.some((r) => r.userId === reaction.userId)
                ? img.reactions.map((r) => (r.userId === reaction.userId ? reaction : r))
                : [...img.reactions, reaction],
            }
          : img
      ),
    })),
}));
