import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';
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

  const poses = [
    "Peace Sign! ✌️",
    "Heart Fingers! 🫶",
    "Big Smile! 😁",
    "Cool Pose! 😎"
  ];

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
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center"
                    style={{ zIndex: 10 }}
                  >
                    <div className="glass-card p-4 rounded-circle mb-3" style={{ background: 'rgba(0,0,0,0.5)' }}>
                       <h1 className="display-1 fw-bold text-white mb-0" style={{ width: '80px', textAlign: 'center' }}>{countdown === 0 ? '📸' : countdown}</h1>
                    </div>
                    <Badge bg="primary" className="fs-5 px-3 py-2 rounded-pill shadow-lg mb-3">Photo {photos.length + 1} / 4</Badge>
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        className="glass-card px-4 py-2 bg-white text-dark fw-bold rounded-pill"
                    >
                        {poses[photos.length]}
                    </motion.div>
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

              <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <ProgressBar 
                    now={(photos.length / 4) * 100} 
                    variant="primary" 
                    className="mb-3 rounded-pill" 
                    style={{ height: '8px', background: 'rgba(255,255,255,0.2)' }} 
                  />
                  <div className="d-flex justify-content-between text-white small fw-bold">
                    <span>PROGRESS</span>
                    <span>{photos.length} / 4 CAPTURED</span>
                  </div>
              </div>
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
