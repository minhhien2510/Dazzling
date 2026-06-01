import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '4rem', height: '4rem' }} />
        <h4 className="fw-bold dazzle-text-gradient">Loading Magic...</h4>
      </div>
    </div>
  );
};

export default LoadingSpinner;
