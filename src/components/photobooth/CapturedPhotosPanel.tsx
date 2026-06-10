import React from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { PHOTOS_REQUIRED } from '../../types/photobooth';

interface CapturedPhotosPanelProps {
  photos: (string | null)[];
  cssFilter?: string;
  onRemove?: (index: number) => void;
  onReplace?: (index: number) => void;
}

const CapturedPhotosPanel: React.FC<CapturedPhotosPanelProps> = ({
  photos,
  cssFilter = 'none',
  onRemove,
  onReplace,
}) => (
  <div>
    <p className="booth-section-title mb-3">Captured Photos</p>
    <div className="row g-2">
      {Array.from({ length: PHOTOS_REQUIRED }, (_, i) => (
        <div key={i} className="col-6">
          <div className={`booth-photo-slot ${photos[i] ? 'filled' : ''}`}>
            {photos[i] ? (
              <img src={photos[i]!} alt={`Photo ${i + 1}`} style={{ filter: cssFilter }} />
            ) : (
              <div className="text-center p-2">
                <Camera size={20} className="text-booth-muted mb-1" />
                <p className="small text-booth-muted mb-0">{i + 1}</p>
              </div>
            )}
          </div>
          {photos[i] && (onRemove || onReplace) && (
            <div className="d-flex gap-1 mt-1 justify-content-center">
              {onRemove && (
                <button
                  type="button"
                  className="btn btn-sm booth-btn-secondary py-0 px-2"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove photo ${i + 1}`}
                >
                  <Trash2 size={12} />
                </button>
              )}
              {onReplace && (
                <button
                  type="button"
                  className="btn btn-sm booth-btn-secondary py-0 px-2"
                  onClick={() => onReplace(i)}
                  aria-label={`Replace photo ${i + 1}`}
                >
                  <Upload size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default CapturedPhotosPanel;
