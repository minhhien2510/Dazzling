import type { FilterOption } from '../../types/photobooth';

export const FILTERS: FilterOption[] = [
  {
    id: 'flagship',
    name: 'Flagship Portrait',
    description: 'Nét mặt, tóc, mắt rõ',
    accent: 'linear-gradient(135deg, #f7fbff, #c7d8ff)',
    cssFilter: 'brightness(1.06) contrast(1.12) saturate(1.04)',
  },
  {
    id: 'natural',
    name: 'Natural HD',
    description: 'Sáng rõ, da tự nhiên',
    accent: 'linear-gradient(135deg, #ffffff, #d8e8ff)',
    cssFilter: 'brightness(1.08) contrast(1.04) saturate(1.08)',
  },
  {
    id: 'soft',
    name: 'Soft Glow',
    description: 'Mềm da, ánh studio',
    accent: 'linear-gradient(135deg, #ffe7f0, #d9ccff)',
    cssFilter: 'brightness(1.14) contrast(0.96) saturate(1.04)',
  },
  {
    id: 'korean',
    name: 'Korean Studio',
    description: 'Tone sáng, clean',
    accent: 'linear-gradient(135deg, #f8f4ff, #ffe7ef)',
    cssFilter: 'brightness(1.18) contrast(0.92) saturate(0.9)',
  },
  {
    id: 'peach',
    name: 'Peach',
    description: 'Ấm nhẹ, hồng da',
    accent: 'linear-gradient(135deg, #ffd1ba, #ff9fb8)',
    cssFilter: 'brightness(1.1) contrast(1.02) saturate(1.16) sepia(0.08) hue-rotate(-6deg)',
  },
  {
    id: 'cinema',
    name: 'Cinema',
    description: 'Tương phản hiện đại',
    accent: 'linear-gradient(135deg, #1b2430, #b7c9ff)',
    cssFilter: 'brightness(1.03) contrast(1.18) saturate(0.95)',
  },
  {
    id: 'cool',
    name: 'Cool Clean',
    description: 'Trắng xanh sạch',
    accent: 'linear-gradient(135deg, #b7dcff, #dff7ff)',
    cssFilter: 'brightness(1.1) contrast(1.04) saturate(0.92) hue-rotate(8deg)',
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Đen trắng nét',
    accent: 'linear-gradient(135deg, #111111, #e8e8e8)',
    cssFilter: 'grayscale(1) brightness(1.08) contrast(1.18)',
  },
];

export function getFilterById(id: string): FilterOption {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}
