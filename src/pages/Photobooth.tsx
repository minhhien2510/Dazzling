import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Sub-components for Stages
import SetupStage from '../components/photobooth/SetupStage';
import CaptureStage from '../components/photobooth/CaptureStage';
import MergeStage from '../components/photobooth/MergeStage';
import ExportStage from '../components/photobooth/ExportStage';

enum BoothStage {
  SETUP = 'SETUP',
  CAPTURE = 'CAPTURE',
  MERGE = 'MERGE',
  EXPORT = 'EXPORT'
}

const Photobooth: React.FC = () => {
  const [stage, setStage] = useState<BoothStage>(BoothStage.SETUP);
  const [config, setConfig] = useState({ layout: '1x4', timer: 3 });
  const [photos, setPhotos] = useState<string[]>([]);
  const [finalStrip, setFinalStrip] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartSession = (sessionConfig: { layout: string, timer: number }) => {
    setConfig(sessionConfig);
    setStage(BoothStage.CAPTURE);
  };

  const handleCaptureComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStage(BoothStage.MERGE);
  };

  const handleMergeComplete = (generatedStrip: string) => {
    setFinalStrip(generatedStrip);
    setStage(BoothStage.EXPORT);
  };

  const resetSession = () => {
    setPhotos([]);
    setFinalStrip(null);
    setStage(BoothStage.SETUP);
  };

  return (
    <Container className="py-5 min-vh-100">
      {stage === BoothStage.SETUP && (
        <SetupStage onStart={handleStartSession} />
      )}
      
      {stage === BoothStage.CAPTURE && (
        <CaptureStage 
          config={config} 
          onComplete={handleCaptureComplete} 
          onCancel={resetSession} 
        />
      )}
      
      {stage === BoothStage.MERGE && (
        <MergeStage 
          photos={photos} 
          config={config} 
          onComplete={handleMergeComplete} 
          onRetake={resetSession}
        />
      )}
      
      {stage === BoothStage.EXPORT && finalStrip && (
        <ExportStage 
          finalStrip={finalStrip} 
          onRestart={resetSession} 
          onGoHome={() => navigate('/')} 
        />
      )}
    </Container>
  );
};

export default Photobooth;

