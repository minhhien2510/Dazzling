import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'motion/react';
import Webcam from 'react-webcam';
import { Camera, Zap, RefreshCw, CheckCircle } from 'lucide-react';

interface CaptureStageProps {
  config: { layout: string, timer: number };
  onComplete: (photos: string[]) => void;
  onCancel: () => void;
}

const CaptureStage: React.FC<CaptureStageProps> = ({ config, onComplete, onCancel }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
       setFlash(true);
       setTimeout(() => setFlash(false), 200);
       setPhotos(prev => [...prev, imageSrc]);
    }
  }, [webcamRef]);

  useEffect(() => {
    if (photos.length === 4) {
      setTimeout(() => onComplete(photos), 1000);
    } else {
      // Start countdown for next photo
      setCountdown(config.timer);
    }
  }, [photos, config.timer, onComplete]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      capturePhoto();
      setCountdown(null);
    }
  }, [countdown, capturePhoto]);

  return (
    <div className="h-100 pb-5">
      <Row className="gy-4 align-items-stretch">
        {/* Camera View */}
        <Col lg={8}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-100">
            <Card className="glass-card overflow-hidden bg-black position-relative h-100 border-0" style={{ minHeight: '500px' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                   width: 1280,
                   height: 720,
                   facingMode: "user"
                }}
                className="w-100 h-100 object-cover"
              />
              
              {/* Overlays */}
              <AnimatePresence>
                {countdown !== null && (
                  <motion.div 
                    key="countdown"
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="position-absolute top-0 start-0 m-4 d-flex align-items-center justify-center rounded-circle bg-black bg-opacity-70"
                    style={{ zIndex: 10, width: '52px', height: '52px' }}
                  >
                    <span className="h4 mb-0 text-white">{countdown === 0 ? '📸' : countdown}</span>
                  </motion.div>
                )}
                {flash && (
                   <motion.div 
                    key="flash"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="position-absolute top-0 start-0 w-100 h-100 bg-white"
                    style={{ zIndex: 20 }}
                  />
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </Col>

        {/* Preview Sidebar */}
        <Col lg={4}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="glass-card p-4 h-100 d-flex flex-column">
               <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-bold mb-0">Captured Shots</h5>
                  <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={onCancel}>Exit</Button>
               </div>

               <div className="d-flex flex-column gap-3 flex-grow-1 overflow-auto pe-2" style={{ maxHeight: '500px' }}>
                  {[0, 1, 2, 3].map(i => (
                    <div 
                        key={i} 
                        className={`ratio ratio-16x9 rounded-4 overflow-hidden border-2 transition-all ${photos[i] ? 'border-success' : 'border-secondary border-opacity-20 border-dashed'}`}
                        style={{ background: 'rgba(0,0,0,0.1)' }}
                    >
                        {photos[i] ? (
                            <img src={photos[i]} alt={`shot-${i}`} className="object-cover" />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center text-secondary opacity-50">
                                <span className="small fw-bold">Shot {i + 1}</span>
                            </div>
                        )}
                        {photos[i] && (
                            <div className="position-absolute top-0 end-0 p-2">
                                <CheckCircle size={20} className="text-success bg-white rounded-circle" />
                            </div>
                        )}
                    </div>
                  ))}
               </div>

               <div className="mt-4 pt-4 border-top border-secondary border-opacity-10 text-center">
                  <p className="small text-secondary mb-0">Stay in position! Auto-capture is active.</p>
               </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default CaptureStage;
