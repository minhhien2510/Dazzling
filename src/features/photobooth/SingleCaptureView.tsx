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
          aspectRatio: { ideal: 3 / 4 }
        } 
      })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Camera error:', err);
        });

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [isLocal, isReviewing, videoRef]);

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
    <div className={cn('relative w-full h-full overflow-hidden rounded-[32px] bg-[#02060f]', filterClasses)}>
      <div className="relative z-10 flex h-full items-center justify-center p-2 sm:p-4">
        <div className="relative w-full h-full max-w-6xl max-h-[88vh]">
          {isReviewing && capturedPreview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <img
                src={capturedPreview}
                className="w-full h-full object-cover rounded-[32px]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ) : (
            <div className="relative h-full w-full">
              {captureMode === 'single' ? (
                <div className="relative mx-auto h-full max-h-[88vh] w-full max-w-[780px] overflow-hidden rounded-[36px] border border-white/10 shadow-[0_45px_120px_rgba(0,0,0,0.65)] bg-slate-950">
                  <video
                    ref={setVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1] brightness-[1.08] contrast-[1.12] saturate-[1.08]"
                  />
                </div>
              ) : (
                <div className="relative mx-auto grid h-full max-h-[88vh] w-full max-w-[880px] grid-cols-2 gap-2 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 p-2 shadow-[0_45px_120px_rgba(0,0,0,0.65)] sm:grid-cols-2 sm:grid-rows-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative overflow-hidden rounded-[28px] bg-slate-900">
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
                          className="w-full h-full object-cover scale-x-[-1] brightness-[1.08] contrast-[1.12]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900/80">
                          <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center text-[11px] font-bold text-white/40">
                            {index + 1}
                          </div>
                        </div>
                      )}

                      {index === currentFrameIndex && countdown !== null && (
                        <div className="absolute inset-0 border-4 border-brand-purple z-10 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-4 left-4 z-20 flex h-9 min-w-[40px] items-center justify-center rounded-full bg-black/75 px-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm"
              >
                {countdown}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
