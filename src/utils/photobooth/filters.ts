import type { FilterOption } from '../../types/photobooth';

export const FILTERS: FilterOption[] = [
  { id: 'original', name: 'Original', cssFilter: 'none' },
  { id: 'retro', name: 'Retro', cssFilter: 'sepia(0.45) contrast(1.15) saturate(1.1)' },
  { id: 'vintage', name: 'Vintage', cssFilter: 'sepia(0.65) brightness(0.92) contrast(1.05)' },
  { id: 'bw', name: 'Black & White', cssFilter: 'grayscale(1) contrast(1.1)' },
  { id: 'warm', name: 'Warm', cssFilter: 'sepia(0.25) saturate(1.35) hue-rotate(-8deg)' },
  { id: 'cool', name: 'Cool', cssFilter: 'saturate(0.85) hue-rotate(12deg) brightness(1.06)' },
  { id: 'korean', name: 'Korean Studio', cssFilter: 'brightness(1.12) contrast(0.94) saturate(0.88)' },
];

export function getFilterById(id: string): FilterOption {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}
