import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Save, Share2, RefreshCw, Home, Image, LogIn } from 'lucide-react';
import LoginRequiredModal from '../LoginRequiredModal';
import SaveImageModal from './SaveImageModal';

interface ResultPreviewProps {
  photos: string[];
  finalStrip: string;
  isAuthenticated: boolean;
  isUploading: boolean;
  onSaveImage: (fileName: string) => Promise<void>;
  onRestart: () => void;
  onGoHome: () => void;
  onViewGallery: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({
  photos,
  finalStrip,
  isAuthenticated,
  isUploading,
  onSaveImage,
  onRestart,
  onGoHome,
  onViewGallery,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `dazzling-moment-${Date.now()}.png`;
    link.href = finalStrip;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(finalStrip).then((r) => r.blob());
        const file = new File([blob], 'dazzling-strip.png', { type: 'image/png' });
        await navigator.share({ title: 'DAZZLING Photostrip', files: [file] });
      } catch {
        downloadImage();
      }
    } else {
      downloadImage();
    }
  };

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowSaveModal(true);
  };

  const handleSave = async (fileName: string) => {
    await onSaveImage(fileName);
    setSaved(true);
    setShowSaveModal(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-4">
          <h2 className="booth-title h3 mb-1">Your Photostrip</h2>
          <p className="text-booth-muted small mb-0">Download, save, or start a new session.</p>
        </div>

        <div className="row g-4 align-items-start result-preview-layout">
          <div className="col-lg-3">
            <p className="booth-section-title">Original Photos</p>
            <div className="row g-2 result-original-grid">
              {photos.map((p, i) => (
                <div key={i} className="col-6 col-lg-12">
                  <div className="booth-photo-slot filled">
                    <img src={p} alt={`Original ${i + 1}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-9">
            <p className="booth-section-title">Generated Strip</p>
            <div className="booth-glass result-strip-frame text-center mb-4">
              <img src={finalStrip} alt="Photostrip result" className="result-strip-image rounded-3" />
            </div>

            {!isAuthenticated && (
              <div className="booth-glass p-3 mb-3 small text-booth-muted">
                Guest mode: photos won&apos;t persist after leaving. Sign in to save to Gallery.
              </div>
            )}

            <div className="d-grid gap-2">
              <button type="button" className="booth-btn-primary py-3" onClick={handleSaveClick} disabled={isUploading || saved}>
                <Save size={18} className="me-2" />
                {saved ? 'Saved to Gallery' : isUploading ? 'Saving...' : 'Save to Gallery'}
              </button>

              {saved && isAuthenticated && (
                <button type="button" className="booth-btn-secondary py-2" onClick={onViewGallery}>
                  <Image size={16} className="me-2" /> View in Gallery
                </button>
              )}

              <div className="row g-2">
                <div className="col-6">
                  <button type="button" className="booth-btn-secondary w-100 py-2" onClick={downloadImage}>
                    <Download size={16} className="me-1" /> Download
                  </button>
                </div>
                <div className="col-6">
                  <button type="button" className="booth-btn-secondary w-100 py-2" onClick={handleShare}>
                    <Share2 size={16} className="me-1" /> Share
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <button type="button" className="booth-btn-secondary" onClick={onGoHome}>
                  <Home size={14} className="me-1" /> Home
                </button>
                <button type="button" className="booth-btn-secondary" onClick={onRestart}>
                  <RefreshCw size={14} className="me-1" /> New Session
                </button>
              </div>

              {!isAuthenticated && (
                <button type="button" className="btn btn-link text-decoration-none small" onClick={() => setShowLoginModal(true)}>
                  <LogIn size={14} className="me-1" /> Sign in to save
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <LoginRequiredModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
      <SaveImageModal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        onSave={handleSave}
        isSaving={isUploading}
      />
    </>
  );
};

export default ResultPreview;
