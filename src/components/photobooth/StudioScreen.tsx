import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import Webcam from 'react-webcam';
import { Camera, Pause, Play, RotateCcw, RefreshCw, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PhotoboothConfig } from '../../types/photobooth';
import { PHOTOS_REQUIRED } from '../../types/photobooth';
import { getFilterById } from '../../utils/photobooth/filters';
import { getFrameById } from '../../utils/photobooth/frames';
import { enhancePortraitDataUrl } from '../../utils/photobooth/portraitEnhancer';
import CameraPreview from './CameraPreview';
import CaptureProgress from './CaptureProgress';
import CapturedPhotosPanel from './CapturedPhotosPanel';
import LiveStripPreview from './LiveStripPreview';
import { CompactFilterBar, CompactFrameBar } from './CompactStyleBar';
import LayoutSelector from './LayoutSelector';

interface StudioScreenProps {
  config: PhotoboothConfig;
  filterId: string;
  frameId: string;
  onConfigChange: (config: PhotoboothConfig) => void;
  onFilterChange: (id: string) => void;
  onFrameChange: (id: string) => void;
  onPhotosChange: (photos: string[]) => void;
  onGenerate: () => void;
  onRestart: () => void;
  onSessionStart?: () => Promise<void>;
  onPhotoCaptured?: (capturedCount: number) => void;
  initialPhotos?: string[];
}

const COUNTDOWN_BEFORE_SHOT = 3;

const StudioScreen: React.FC<StudioScreenProps> = ({
  config,
  filterId,
  frameId,
  onConfigChange,
  onFilterChange,
  onFrameChange,
  onPhotosChange,
  onGenerate,
  onRestart,
  onSessionStart,
  onPhotoCaptured,
  initialPhotos,
}) => {
  const [slots, setSlots] = useState<(string | null)[]>(() => {
    if (initialPhotos?.length) {
      const arr = Array(PHOTOS_REQUIRED).fill(null) as (string | null)[];
      initialPhotos.forEach((p, i) => { arr[i] = p; });
      return arr;
    }
    return Array(PHOTOS_REQUIRED).fill(null);
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [paused, setPaused] = useState(false);
  const [waitingInterval, setWaitingInterval] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const autoStartedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef(0);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const filter = getFilterById(filterId);
  const frame = getFrameById(frameId);
  const capturedCount = slots.filter(Boolean).length;
  const isFull = capturedCount >= PHOTOS_REQUIRED;

  const syncPhotos = useCallback(
    (next: (string | null)[]) => {
      setSlots(next);
      onPhotosChange(next.filter((p): p is string => !!p));
    },
    [onPhotosChange],
  );

  const ensureSession = useCallback(async () => {
    if (sessionStarted || !onSessionStart) return;
    await onSessionStart();
    setSessionStarted(true);
  }, [sessionStarted, onSessionStart]);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    await ensureSession();

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    let finalImageSrc = imageSrc;
    try {
      finalImageSrc = await enhancePortraitDataUrl(imageSrc);
    } catch {
      finalImageSrc = imageSrc;
    }

    setSlots((prev) => {
      const next = [...prev];
      const emptyIdx = next.findIndex((p) => !p);
      if (emptyIdx === -1) return prev;
      next[emptyIdx] = finalImageSrc;
      onPhotoCaptured?.(next.filter(Boolean).length);
      onPhotosChange(next.filter((p): p is string => !!p));
      return next;
    });
  }, [ensureSession, onPhotoCaptured, onPhotosChange]);

  const startCountdown = useCallback(() => {
    if (paused || isFull) return;
    setCountdown(COUNTDOWN_BEFORE_SHOT);
  }, [paused, isFull]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setTimeout(() => {
      if (countdown === 1) {
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown, capturePhoto]);

  useEffect(() => {
    if (config.mode !== 'auto' || paused || isFull || waitingInterval || countdown !== null) return;

    if (!autoStartedRef.current && capturedCount === 0) {
      autoStartedRef.current = true;
      startCountdown();
      return;
    }

    if (capturedCount > 0 && capturedCount < PHOTOS_REQUIRED) {
      setWaitingInterval(true);
      const t = setTimeout(() => {
        setWaitingInterval(false);
        startCountdown();
      }, config.interval * 1000);
      return () => clearTimeout(t);
    }
  }, [config.mode, config.interval, paused, isFull, capturedCount, waitingInterval, countdown, startCountdown]);

  const handleManualCapture = () => {
    if (isFull) return;
    capturePhoto();
  };

  const handleRetakeLast = () => {
    setSlots((prev) => {
      const next = [...prev];
      for (let i = PHOTOS_REQUIRED - 1; i >= 0; i--) {
        if (next[i]) {
          next[i] = null;
          break;
        }
      }
      onPhotosChange(next.filter((p): p is string => !!p));
      return next;
    });
    autoStartedRef.current = false;
  };

  const handleRemove = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      onPhotosChange(next.filter((p): p is string => !!p));
      return next;
    });
  };

  const handleReplace = (index: number) => {
    replaceIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSlots((prev) => {
        const next = [...prev];
        next[replaceIndexRef.current] = reader.result as string;
        onPhotosChange(next.filter((p): p is string => !!p));
        return next;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUploadAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files).slice(0, PHOTOS_REQUIRED);
    if (fileArr.length < PHOTOS_REQUIRED) {
      toast.error(`Cần chọn ${PHOTOS_REQUIRED} ảnh`);
      return;
    }
    Promise.all(
      fileArr.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((loaded) => {
      const next = loaded as (string | null)[];
      syncPhotos(next);
      toast.success('Đã tải ảnh lên');
    });
    e.target.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mb-4">
        <h1 className="booth-title mb-1">Photobooth Studio</h1>
        <p className="text-booth-muted small mb-0">
          Chọn layout, canh khung, chụp ảnh, rồi tinh chỉnh màu ngay trên cùng một màn hình
        </p>
      </div>

      <div className="booth-glass p-3 p-md-4 mb-4">
        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <LayoutSelector
              layout={config.layout}
              onChange={(layout) => onConfigChange({ ...config, layout })}
            />
          </div>

          <div className="col-lg-4">
            <p className="booth-section-title">Chế độ chụp</p>
            <div className="d-flex gap-2 mb-3" role="group" aria-label="Capture mode">
              <button
                type="button"
                className={`booth-btn-secondary flex-grow-1 ${config.mode === 'manual' ? 'selected' : ''}`}
                style={
                  config.mode === 'manual'
                    ? { borderColor: '#b8a8d8', background: 'rgba(184,168,216,0.18)' }
                    : undefined
                }
                onClick={() => onConfigChange({ ...config, mode: 'manual' })}
                aria-pressed={config.mode === 'manual'}
              >
                Chụp tay
              </button>
              <button
                type="button"
                className={`booth-btn-secondary flex-grow-1 ${config.mode === 'auto' ? 'selected' : ''}`}
                style={
                  config.mode === 'auto'
                    ? { borderColor: '#b8a8d8', background: 'rgba(184,168,216,0.18)' }
                    : undefined
                }
                onClick={() => onConfigChange({ ...config, mode: 'auto' })}
                aria-pressed={config.mode === 'auto'}
              >
                Auto
              </button>
            </div>

            {config.mode === 'auto' && (
              <div>
                <p className="small fw-semibold mb-2">Thời gian đếm ngược</p>
                <div className="d-flex gap-2">
                  {[3, 5, 10].map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      className="booth-btn-secondary flex-grow-1"
                      style={
                        config.interval === interval
                          ? { borderColor: '#b8a8d8', background: 'rgba(184,168,216,0.18)' }
                          : undefined
                      }
                      onClick={() => onConfigChange({ ...config, interval: interval as 3 | 5 | 10 })}
                      aria-pressed={config.interval === interval}
                    >
                      {interval}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <CompactFrameBar
              title="Khung preview khi chụp"
              selectedId={frameId}
              onChange={onFrameChange}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <CaptureProgress capturedCount={capturedCount} />

          <CameraPreview
            ref={webcamRef}
            countdown={countdown}
            flash={flash}
            cssFilter={filter.cssFilter}
            frameColor={frame.color}
          />

          {waitingInterval && config.mode === 'auto' && (
            <p className="small text-booth-muted text-center mt-2 mb-0">
              Ảnh tiếp theo sau {config.interval}s...
            </p>
          )}

          <div className="booth-action-bar d-flex flex-wrap gap-2 mt-3">
            {config.mode === 'manual' ? (
              <button
                type="button"
                className="booth-btn-primary"
                onClick={handleManualCapture}
                disabled={isFull}
              >
                <Camera size={18} className="me-2" />
                Chụp ảnh
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="booth-btn-secondary"
                  onClick={() => setPaused(true)}
                  disabled={paused || isFull}
                >
                  <Pause size={16} className="me-1" /> Tạm dừng
                </button>
                <button
                  type="button"
                  className="booth-btn-secondary"
                  onClick={() => {
                    setPaused(false);
                    if (!isFull && countdown === null && !waitingInterval) startCountdown();
                  }}
                  disabled={!paused}
                >
                  <Play size={16} className="me-1" /> Tiếp tục
                </button>
              </>
            )}
            <button
              type="button"
              className="booth-btn-secondary"
              onClick={handleRetakeLast}
              disabled={capturedCount === 0}
            >
              <RotateCcw size={16} className="me-1" /> Chụp lại
            </button>
            <button type="button" className="booth-btn-secondary" onClick={onRestart}>
              <RefreshCw size={16} className="me-1" /> Làm mới
            </button>
            <button
              type="button"
              className="booth-btn-secondary"
              onClick={() => uploadInputRef.current?.click()}
            >
              <Upload size={16} className="me-1" />
              Tải ảnh lên
            </button>
          </div>

          <div className="booth-glass p-3 p-md-4 mt-4">
            <CompactFilterBar selectedId={filterId} onChange={onFilterChange} />
          </div>

          {isFull && (
            <button
              type="button"
              className="booth-btn-primary w-100 mt-3 py-3"
              onClick={onGenerate}
            >
              <Sparkles size={18} className="me-2" />
              Tạo Photostrip
            </button>
          )}
        </div>

        <div className="col-lg-4">
          <div className="booth-glass p-3 p-md-4 d-flex flex-column gap-3">
            <CapturedPhotosPanel
              photos={slots}
              cssFilter={filter.cssFilter}
              onRemove={handleRemove}
              onReplace={handleReplace}
            />

            <LiveStripPreview
              photos={slots}
              layout={config.layout}
              frame={frame}
              cssFilter={filter.cssFilter}
            />

            {capturedCount === 0 && (
              <p className="small text-booth-muted text-center mb-0">📷 Chưa có ảnh nào</p>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleReplaceFile} />
            <input ref={uploadInputRef} type="file" accept="image/*" multiple className="d-none" onChange={handleUploadAll} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudioScreen;
