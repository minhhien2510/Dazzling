export type BoothStage = 'STUDIO' | 'GENERATING' | 'COMPLETED';

export type CaptureMode = 'auto' | 'manual';
export type LayoutType = '1x4' | '2x2';
export type IntervalOption = 3 | 5 | 10;

export interface PhotoboothConfig {
  layout: LayoutType;
  mode: CaptureMode;
  interval: IntervalOption;
}

export interface FilterOption {
  id: string;
  name: string;
  description?: string;
  accent?: string;
  cssFilter: string;
}

export interface FrameOption {
  id: string;
  name: string;
  color: string;
  textColor: string;
  accent?: string;
}

export const PHOTOS_REQUIRED = 4;

export const NAME_SUGGESTIONS = [
  'Birthday Party',
  'Besties Hangout',
  'Date Night',
  'Graduation 2026',
  'Summer Vibes',
  'Office Party',
  'Wedding Guest',
  'Korean Studio',
  'DAZZLING Moment',
];
