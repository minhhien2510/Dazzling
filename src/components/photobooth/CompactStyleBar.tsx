import React from 'react';
import { FILTERS } from '../../utils/photobooth/filters';
import { FRAMES } from '../../utils/photobooth/frames';

interface CompactStyleBarProps {
  filterId: string;
  frameId: string;
  onFilterChange: (id: string) => void;
  onFrameChange: (id: string) => void;
}

export const CompactFilterBar: React.FC<{
  selectedId: string;
  onChange: (id: string) => void;
}> = ({ selectedId, onChange }) => (
  <div>
    <p className="booth-section-title">Filter</p>
    <div className="booth-filter-chip-row d-flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`booth-filter-chip ${selectedId === f.id ? 'selected' : ''}`}
          style={
            selectedId === f.id
              ? { borderColor: '#b8a8d8', background: 'rgba(184,168,216,0.2)' }
              : undefined
          }
          onClick={() => onChange(f.id)}
          aria-pressed={selectedId === f.id}
        >
          <span className="booth-filter-swatch" style={{ background: f.accent }} />
          <span className="text-start">
            <span className="d-block fw-semibold">{f.name}</span>
            {f.description && <span className="d-block text-booth-muted">{f.description}</span>}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export const CompactFrameBar: React.FC<{
  selectedId: string;
  onChange: (id: string) => void;
  title?: string;
}> = ({ selectedId, onChange, title = 'Frame' }) => (
  <div>
    <p className="booth-section-title">{title}</p>
    <div className="d-flex flex-wrap gap-2">
      {FRAMES.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`booth-option-card p-2 d-flex align-items-center gap-2 ${selectedId === f.id ? 'selected' : ''}`}
          style={{ minWidth: 0 }}
          onClick={() => onChange(f.id)}
          aria-pressed={selectedId === f.id}
        >
          <span
            className="rounded-2 flex-shrink-0"
            style={{ width: 20, height: 28, background: f.color, border: `1px solid ${f.textColor}33` }}
          />
          <span className="small fw-semibold">{f.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const CompactStyleBar: React.FC<CompactStyleBarProps> = (props) => (
  <>
    <CompactFrameBar selectedId={props.frameId} onChange={props.onFrameChange} />
    <div className="mt-3">
      <CompactFilterBar selectedId={props.filterId} onChange={props.onFilterChange} />
    </div>
  </>
);

export default CompactStyleBar;
