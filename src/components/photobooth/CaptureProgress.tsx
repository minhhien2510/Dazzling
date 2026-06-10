import React from 'react';
import { PHOTOS_REQUIRED } from '../../types/photobooth';

interface CaptureProgressProps {
  capturedCount: number;
}

const CaptureProgress: React.FC<CaptureProgressProps> = ({ capturedCount }) => {
  const percent = Math.round((capturedCount / PHOTOS_REQUIRED) * 100);

  return (
    <div className="mb-3" aria-live="polite">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-semibold">
          Captured {capturedCount} / {PHOTOS_REQUIRED}
        </span>
        <span className="small text-booth-muted">{percent}%</span>
      </div>
      <div className="booth-progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="booth-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default CaptureProgress;
