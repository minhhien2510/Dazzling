import React from 'react';
import { FRAMES } from '../../utils/photobooth/frames';

interface FrameSelectorProps {
  selectedId: string;
  onChange: (id: string) => void;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedId, onChange }) => (
  <div>
    <p className="booth-section-title">Frames</p>
    <div className="row g-2">
      {FRAMES.map((frame) => (
        <div key={frame.id} className="col-6 col-md-4">
          <button
            type="button"
            className={`booth-option-card w-100 p-3 ${selectedId === frame.id ? 'selected' : ''}`}
            onClick={() => onChange(frame.id)}
            aria-pressed={selectedId === frame.id}
          >
            <div
              className="rounded-3 mb-2 mx-auto d-flex align-items-end justify-content-center pb-2"
              style={{
                width: 48,
                height: 64,
                background: frame.color,
                border: `2px solid ${frame.accent ?? frame.textColor}33`,
              }}
            >
              <span style={{ fontSize: 8, color: frame.textColor, fontWeight: 700 }}>DAZZLING</span>
            </div>
            <span className="small fw-semibold">{frame.name}</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default FrameSelector;
