import React from 'react';
import { Zap, Hand } from 'lucide-react';
import type { CaptureMode, IntervalOption } from '../../types/photobooth';

interface CaptureModeSelectorProps {
  mode: CaptureMode;
  interval: IntervalOption;
  onModeChange: (mode: CaptureMode) => void;
  onIntervalChange: (interval: IntervalOption) => void;
}

const INTERVALS: IntervalOption[] = [3, 5, 10];

const CaptureModeSelector: React.FC<CaptureModeSelectorProps> = ({
  mode,
  interval,
  onModeChange,
  onIntervalChange,
}) => (
  <div>
    <p className="booth-section-title">Capture Mode</p>
    <div className="row g-3 mb-3">
      <div className="col-md-6">
        <button
          type="button"
          className={`booth-option-card w-100 text-start ${mode === 'auto' ? 'selected' : ''}`}
          onClick={() => onModeChange('auto')}
          aria-pressed={mode === 'auto'}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <Zap size={20} className="text-warning" />
            <span className="fw-bold">Auto Mode</span>
          </div>
          <p className="small text-booth-muted mb-0">
            System will automatically capture all photos after each interval.
          </p>
        </button>
      </div>
      <div className="col-md-6">
        <button
          type="button"
          className={`booth-option-card w-100 text-start ${mode === 'manual' ? 'selected' : ''}`}
          onClick={() => onModeChange('manual')}
          aria-pressed={mode === 'manual'}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <Hand size={20} />
            <span className="fw-bold">Manual Mode</span>
          </div>
          <p className="small text-booth-muted mb-0">
            Capture each photo manually.
          </p>
        </button>
      </div>
    </div>

    {mode === 'auto' && (
      <div role="group" aria-label="Capture interval">
        <p className="small fw-semibold mb-2">Interval between shots</p>
        <div className="d-flex gap-2">
          {INTERVALS.map((t) => (
            <button
              key={t}
              type="button"
              className={`booth-btn-secondary flex-grow-1 ${interval === t ? 'selected' : ''}`}
              style={interval === t ? { borderColor: '#b8a8d8', background: 'rgba(184,168,216,0.15)' } : undefined}
              onClick={() => onIntervalChange(t)}
              aria-pressed={interval === t}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default CaptureModeSelector;
