import React from 'react';
import type { LayoutType } from '../../types/photobooth';

interface LayoutSelectorProps {
  layout: LayoutType;
  onChange: (layout: LayoutType) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ layout, onChange }) => (
  <div>
    <p className="booth-section-title">Layout</p>
    <div className="row g-3">
      <div className="col-6">
        <button
          type="button"
          className={`booth-option-card w-100 ${layout === '1x4' ? 'selected' : ''}`}
          onClick={() => onChange('1x4')}
          aria-pressed={layout === '1x4'}
        >
          <div className="d-flex justify-content-center mb-3">
            <div
              className="d-flex flex-column gap-1 p-2 rounded-3"
              style={{ background: 'rgba(0,0,0,0.3)', width: 56 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 14, background: 'rgba(184,168,216,0.5)', borderRadius: 2 }} />
              ))}
            </div>
          </div>
          <p className="fw-bold mb-0 text-center">1×4 Classic Strip</p>
          <p className="small text-booth-muted text-center mb-0">Vertical photostrip</p>
        </button>
      </div>
      <div className="col-6">
        <button
          type="button"
          className={`booth-option-card w-100 ${layout === '2x2' ? 'selected' : ''}`}
          onClick={() => onChange('2x2')}
          aria-pressed={layout === '2x2'}
        >
          <div className="d-flex justify-content-center mb-3">
            <div
              className="d-grid gap-1 p-2 rounded-3"
              style={{ background: 'rgba(0,0,0,0.3)', width: 56, gridTemplateColumns: '1fr 1fr' }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 22, background: 'rgba(184,168,216,0.5)', borderRadius: 2 }} />
              ))}
            </div>
          </div>
          <p className="fw-bold mb-0 text-center">2×2 Grid</p>
          <p className="small text-booth-muted text-center mb-0">Square collage</p>
        </button>
      </div>
    </div>
  </div>
);

export default LayoutSelector;
