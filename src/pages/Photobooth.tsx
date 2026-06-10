import React, { useState, useCallback, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import StepIndicator from '../components/photobooth/StepIndicator';
import StudioScreen from '../components/photobooth/StudioScreen';
import ResultPreview from '../components/photobooth/ResultPreview';
import GuestModeBanner from '../components/GuestModeBanner';
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';
import { useGallery } from '../context/GalleryContext';
import { getApiErrorMessage } from '../services/apiClient';
import { dataUrlToFile } from '../utils/image';
import { composePhotostrip } from '../utils/photobooth/stripComposer';
import { getFrameById } from '../utils/photobooth/frames';
import type { BoothStage, PhotoboothConfig } from '../types/photobooth';
import { PHOTOS_REQUIRED } from '../types/photobooth';

const Photobooth: React.FC = () => {
  const [stage, setStage] = useState<BoothStage>('STUDIO');
  const [config, setConfig] = useState<PhotoboothConfig>({
    layout: '1x4',
    mode: 'manual',
    interval: 3,
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [filterId, setFilterId] = useState('original');
  const [frameId, setFrameId] = useState('classic');
  const [finalStrip, setFinalStrip] = useState<string | null>(null);

  const sessionCreatedRef = useRef(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentSession, createSession, clearCurrentSession } = useSession();
  const { uploadImage, isUploading } = useGallery();

  const resetAll = useCallback(() => {
    setPhotos([]);
    setFinalStrip(null);
    setFilterId('original');
    setFrameId('classic');
    setConfig({ layout: '1x4', mode: 'manual', interval: 3 });
    sessionCreatedRef.current = false;
    clearCurrentSession();
    setStage('STUDIO');
  }, [clearCurrentSession]);

  const handleSessionStart = useCallback(async () => {
    if (sessionCreatedRef.current || !isAuthenticated) return;
    const sessionName = `Session ${new Date().toLocaleString('vi-VN')}`;
    await createSession(sessionName, config.layout);
    sessionCreatedRef.current = true;
    toast.success('Session đã sẵn sàng');
  }, [isAuthenticated, createSession, config.layout]);

  const handleGenerate = async () => {
    if (photos.length !== PHOTOS_REQUIRED) {
      toast.error(`Cần ${PHOTOS_REQUIRED} ảnh để tạo strip`);
      return;
    }
    setStage('GENERATING');
    try {
      const frame = getFrameById(frameId);
      const strip = await composePhotostrip(photos, config.layout, frame, filterId);
      setFinalStrip(strip);
      setStage('COMPLETED');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setStage('STUDIO');
    }
  };

  const handleSaveImage = async (fileName: string) => {
    if (!finalStrip) return;
    const safeName = fileName.replace(/[^\w\s-]/g, '').trim() || 'dazzling-moment';
    const file = dataUrlToFile(finalStrip, `${safeName}.png`);
    await uploadImage(file, currentSession?.id);
    toast.success('Đã lưu vào Gallery!');
  };

  return (
    <div className="photobooth-studio">
      <div className="container-fluid" style={{ maxWidth: 1280 }}>
        {!isAuthenticated && <GuestModeBanner />}

        <StepIndicator currentStage={stage} />

        {stage === 'STUDIO' && (
          <StudioScreen
            config={config}
            filterId={filterId}
            frameId={frameId}
            onConfigChange={setConfig}
            onFilterChange={setFilterId}
            onFrameChange={setFrameId}
            onPhotosChange={setPhotos}
            onGenerate={handleGenerate}
            onRestart={resetAll}
            onSessionStart={isAuthenticated ? handleSessionStart : undefined}
          />
        )}

        {stage === 'GENERATING' && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="text-booth-muted mt-3 mb-0">Đang tạo photostrip...</p>
          </div>
        )}

        {stage === 'COMPLETED' && finalStrip && (
          <ResultPreview
            photos={photos}
            finalStrip={finalStrip}
            isAuthenticated={isAuthenticated}
            isUploading={isUploading}
            onSaveImage={handleSaveImage}
            onRestart={resetAll}
            onGoHome={() => navigate('/')}
            onViewGallery={() => navigate('/gallery')}
          />
        )}
      </div>
    </div>
  );
};

export default Photobooth;
