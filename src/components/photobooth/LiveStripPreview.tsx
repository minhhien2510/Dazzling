import React from 'react';
import type { LayoutType } from '../../types/photobooth';
import type { FrameOption } from '../../types/photobooth';
import { PHOTOS_REQUIRED } from '../../types/photobooth';

interface LiveStripPreviewProps {
  photos: (string | null)[];
  layout: LayoutType;
  frame: FrameOption;
  cssFilter: string;
}

const LiveStripPreview: React.FC<LiveStripPreviewProps> = ({
  photos,
  layout,
  frame,
  cssFilter,
}) => {
  const filled = photos.filter(Boolean).length;
  if (filled === 0) return null;

  const slots = Array.from({ length: PHOTOS_REQUIRED }, (_, i) => photos[i]);

  return (
    <div className="mt-3">
      <p className="booth-section-title mb-2">Strip Preview</p>
      <div
        className="rounded-3 p-2 mx-auto"
        style={{
          background: frame.color,
          maxWidth: layout === '1x4' ? 120 : 160,
        }}
      >
        <div
          className={layout === '1x4' ? 'd-flex flex-column gap-1' : 'd-grid gap-1'}
          style={layout === '2x2' ? { gridTemplateColumns: '1fr 1fr' } : undefined}
        >
          {slots.map((src, i) => (
            <div
              key={i}
              style={{
                aspectRatio: layout === '1x4' ? '4/3' : '1/1',
                background: 'rgba(0,0,0,0.15)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="w-100 h-100"
                  style={{ objectFit: 'cover', filter: cssFilter }}
                />
              ) : (
                <div className="w-100 h-100 bg-dark bg-opacity-25" />
              )}
            </div>
          ))}
        </div>
        <p
          className="text-center mb-0 mt-1"
          style={{ fontSize: 7, color: frame.textColor, fontWeight: 700 }}
        >
          DAZZLING
        </p>
      </div>
    </div>
  );
};

export default LiveStripPreview;
