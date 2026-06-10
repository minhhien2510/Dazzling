import type { FrameOption } from '../../types/photobooth';

export const FRAMES: FrameOption[] = [
  { id: 'classic', name: 'Classic', color: '#FAF7F2', textColor: '#2B2B2B' },
  { id: 'pink', name: 'Pink', color: '#F8D7E8', textColor: '#5C3D4F', accent: '#D9A5B3' },
  { id: 'retro', name: 'Retro', color: '#E8D5B5', textColor: '#4A3728' },
  { id: 'neon', name: 'Neon', color: '#1A1A2E', textColor: '#E94560', accent: '#9A89B8' },
  { id: 'minimal', name: 'Minimal', color: '#FFFFFF', textColor: '#333333' },
];

export function getFrameById(id: string): FrameOption {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
