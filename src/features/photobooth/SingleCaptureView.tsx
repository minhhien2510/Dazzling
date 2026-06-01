import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../shared/utils';

interface SingleCaptureViewProps {
  isLocal: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  selectedFilter: string;
  selectedFrame: string;
  countdown: number | null;
  isCapturing: boolean;
  capturedPreview: string | null;
  isReviewing: boolean;
  onRetake: () => void;
  onSave: () => void;
  captureMode: 'single' | 'multi';
  multiCaptures: string[];
  currentFrameIndex: number;
}

export const SingleCaptureView: React.FC<SingleCaptureViewProps> = ({
  isLocal,
  videoRef,
  selectedFilter,
  selectedFrame,
  countdown,
  isCapturing,
  capturedPreview,
  isReviewing,
  onRetake,
  onSave,
  captureMode,
  multiCaptures,
  currentFrameIndex,
}) => {
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isLocal && !isReviewing) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 },
          aspectRatio: { ideal: 3/4 }
        } 
      })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Camera error:", err);
        });
        
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [isLocal, isReviewing]);

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    if (videoRef) {
      (videoRef as any).current = el;
    }
    if (el && streamRef.current && !isReviewing) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, [videoRef, isReviewing]);

  const filterClasses = cn(
    selectedFilter === 'sepia' && 'sepia',
    selectedFilter === 'grayscale' && 'grayscale',
    selectedFilter === 'vibrant' && 'saturate-150 brightness-110'
  );

  return (
  <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
    
    {/* Review Mode */}
    {isReviewing && capturedPreview ? (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-40 bg-black"
      >
        <img
          src={capturedPreview}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    ) : (
      <div className={cn("absolute inset-0", filterClasses)}>
        {captureMode === 'single' ? (
          <video
            ref={setVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 bg-black p-1">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative overflow-hidden bg-slate-900 rounded-lg">
                {multiCaptures[index] ? (
                  <img 
                    src={multiCaptures[index]} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : index === currentFrameIndex ? (
                  <video
                    ref={setVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-[10px] font-bold text-white/20">
                      {index + 1}
                    </div>
                  </div>
                )}
                
                {/* Active Frame Indicator */}
                {index === currentFrameIndex && countdown !== null && (
                  <div className="absolute inset-0 border-4 border-brand-purple z-10 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Countdown */}
    <AnimatePresence>
      {countdown !== null && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center z-50 bg-black/30"
        >
          <motion.span
            key={countdown}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[120px] font-bold text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]"
          >
            {countdown}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Flash Effect */}
    <AnimatePresence>
      {isCapturing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white z-[60]"
        />
      )}
    </AnimatePresence>
  </div>
);
};
