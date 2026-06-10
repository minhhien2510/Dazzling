import React, { forwardRef } from 'react';
import Webcam from 'react-webcam';
import { AnimatePresence, motion } from 'motion/react';

interface CameraPreviewProps {
  countdown: number | null;
  flash: boolean;
  cssFilter?: string;
  frameColor?: string;
}

const CameraPreview = forwardRef<Webcam, CameraPreviewProps>(
  ({ countdown, flash, cssFilter = 'none', frameColor }, ref) => (
    <div
      className="booth-camera-frame rounded-4 overflow-hidden"
      style={{
        background: frameColor ?? '#000',
        padding: frameColor ? 8 : 0,
      }}
    >
      <div
        className="booth-camera-screen booth-glass overflow-hidden position-relative"
        style={{ background: '#000' }}
      >
        <Webcam
          ref={ref}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          screenshotQuality={0.98}
          videoConstraints={{
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            aspectRatio: { ideal: 16 / 9 },
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'user',
          }}
          className="w-100 h-100"
          style={{ objectFit: 'cover', filter: cssFilter }}
        />
        <div className="booth-camera-beauty-overlay" aria-hidden="true" />

        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="booth-countdown"
              aria-live="assertive"
            >
              {countdown}
            </motion.div>
          )}
        </AnimatePresence>

        {flash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="position-absolute top-0 start-0 w-100 h-100 bg-white"
            style={{ zIndex: 20, pointerEvents: 'none' }}
          />
        )}
      </div>
    </div>
  ),
);

CameraPreview.displayName = 'CameraPreview';

export default CameraPreview;
