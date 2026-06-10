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
      className="rounded-4 overflow-hidden"
      style={{
        background: frameColor ?? '#000',
        padding: frameColor ? 10 : 0,
      }}
    >
      <div
        className="booth-glass overflow-hidden position-relative"
        style={{ minHeight: 'clamp(220px, 56vw, 360px)', aspectRatio: '16/10', background: '#000' }}
      >
        <Webcam
          ref={ref}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
          className="w-100 h-100"
          style={{ objectFit: 'cover', filter: cssFilter }}
        />

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
