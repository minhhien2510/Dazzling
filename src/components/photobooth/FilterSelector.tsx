import React from 'react';
import { FILTERS } from '../../utils/photobooth/filters';

interface FilterSelectorProps {
  selectedId: string;
  previewSrc: string;
  onChange: (id: string) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ selectedId, previewSrc, onChange }) => (
  <div>
    <p className="booth-section-title">Filters</p>
    <div className="row g-2">
      {FILTERS.map((filter) => (
        <div key={filter.id} className="col-6 col-md-4 col-lg-3">
          <button
            type="button"
            className={`booth-option-card w-100 p-2 ${selectedId === filter.id ? 'selected' : ''}`}
            onClick={() => onChange(filter.id)}
            aria-pressed={selectedId === filter.id}
          >
            <div className="booth-filter-preview rounded-3 overflow-hidden mb-2" style={{ aspectRatio: '4/3' }}>
              <img src={previewSrc} alt="" style={{ filter: filter.cssFilter }} />
            </div>
            <span className="small fw-semibold">{filter.name}</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default FilterSelector;
