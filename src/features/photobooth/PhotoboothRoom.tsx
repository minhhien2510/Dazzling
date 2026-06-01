import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MessageSquare, Users, X, Send, Smile, Sparkles, Image as ImageIcon, Heart, MessageCircle, Download, Share2, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../../shared/ui/Button';
import { GlassCard } from '../../shared/ui/GlassCard';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useImageStore } from '../stores/imageStore';
import { useRoomStore } from '../stores/roomStore';
import { storageService } from '../../core/storage/storage.service';
import { StoryExportModal } from '../story-export/StoryExportModal';
import { PhotoEditorModal } from './PhotoEditorModal';
import { SingleCaptureView } from './SingleCaptureView';
import { mockUsers } from '../../mocks/data';
import { formatTime, cn } from '../../shared/utils';
import { ImageAsset } from '../../types';
import { useParams, useNavigate } from 'react-router-dom';

export const PhotoboothRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, addMessage, typingUsers, setTyping } = useChatStore();
  const { images, addImage, addReaction, addComment, updateImage } = useImageStore();
  const { rooms, joinRoom, activeRoom } = useRoomStore();
  
  const [activeTab, setActiveTab] = useState<'camera' | 'chat' | 'gallery'>('gallery');
  const [captureMode, setCaptureMode] = useState<'single' | 'multi'>('single');
  const [multiCaptures, setMultiCaptures] = useState<string[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedFrame, setSelectedFrame] = useState('classic');
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageAsset | null>(null);
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(true);
  const [hiddenPreviewIndexes, setHiddenPreviewIndexes] = useState<number[]>([]);
  
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Roles: First user is host
  const isHost = true; 

  useEffect(() => {
    if (id) {
      joinRoom(id);
    }
  }, [id, joinRoom]);

  // Mock Realtime: Simulate other users joining and typing
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage({
        id: Math.random().toString(),
        senderId: 'system',
        content: 'Hoàng Nam đã tham gia phòng',
        type: 'system',
        timestamp: Date.now(),
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const previewSources = multiCaptures.length > 0 ? multiCaptures : capturedPreview ? [capturedPreview] : [];
  const previewItems = previewSources.filter((_, index) => !hiddenPreviewIndexes.includes(index));

  useEffect(() => {
    setHiddenPreviewIndexes([]);
  }, [multiCaptures.length, capturedPreview]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    addMessage({
      id: Math.random().toString(),
      senderId: user?.id || '1',
      content: chatInput,
      type: 'text',
      timestamp: Date.now(),
    });
    setChatInput('');
  };

  const startCapture = () => {
    if (countdown !== null || isCapturing) return;
    
    if (captureMode === 'multi') {
      setMultiCaptures([]);
      setCurrentFrameIndex(0);
      startMultiCaptureSequence();
      return;
    }

    if (!autoCaptureEnabled) {
      capturePhoto();
      return;
    }

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const startMultiCaptureSequence = async () => {
    const captures: string[] = [];
    
    for (let i = 0; i < 4; i++) {
      setCurrentFrameIndex(i);
      setCountdown(3);
      
      // Wait for countdown
      await new Promise(resolve => {
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              resolve(null);
              return null;
            }
            return prev ? prev - 1 : null;
          });
        }, 1000);
      });

      // Capture photo
      const dataUrl = await capturePhoto();
      if (dataUrl) {
        captures.push(dataUrl);
        setMultiCaptures(prev => [...prev, dataUrl]);
      }
      
      // Short pause between captures
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // After 4 captures, merge them
    await mergeMultiCaptures(captures);
  };

  const mergeMultiCaptures = async (captures: string[]) => {
    if (captures.length < 4 || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsCapturing(false);
      return;
    }

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = captures[0];
      });

      const w = img.width;
      const h = img.height;
      
      // Create a 2x2 grid with elegant white borders
      const padding = Math.floor(w * 0.05);
      const gap = Math.floor(w * 0.02);
      const footerHeight = Math.floor(h * 0.15);
      
      canvas.width = w * 2 + padding * 2 + gap;
      canvas.height = h * 2 + padding * 2 + gap + footerHeight;
      
      // White background (classic photobooth feel)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const drawFrame = async (src: string, x: number, y: number) => {
        const frameImg = new Image();
        await new Promise((resolve, reject) => {
          frameImg.onload = resolve;
          frameImg.onerror = reject;
          frameImg.src = src;
        });
        ctx.drawImage(frameImg, x, y, w, h);
      };

      await Promise.all([
        drawFrame(captures[0], padding, padding),
        drawFrame(captures[1], padding + w + gap, padding),
        drawFrame(captures[2], padding, padding + h + gap),
        drawFrame(captures[3], padding + w + gap, padding + h + gap)
      ]);

      // Add branding at the bottom
      ctx.fillStyle = '#9D72FF'; // brand-purple
      ctx.font = `bold ${Math.floor(footerHeight * 0.4)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('DAZZLING PHOTOBOOTH', canvas.width / 2, canvas.height - (footerHeight / 2) + 10);
      
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = `${Math.floor(footerHeight * 0.2)}px sans-serif`;
      ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - (footerHeight / 4));

      const mergedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPreview(mergedDataUrl);
      setIsReviewing(true);
      setIsCapturing(false);
      
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF85B3', '#9D72FF', '#FFFFFF'],
      });
    } catch (error) {
      console.error("Merge error:", error);
      setIsCapturing(false);
      setCapturedPreview(captures[0]);
      setIsReviewing(true);
    }
  };

  const capturePhoto = async (): Promise<string | null> => {
    setIsCapturing(true);
    
    try {
      // Play shutter sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3');
      audio.play().catch(() => {});

      // Real Capture Logic
      if (localVideoRef.current && canvasRef.current) {
        const video = localVideoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Fallback to mock if video dimensions are not available
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            return new Promise((resolve) => {
              setTimeout(() => {
                setIsCapturing(false);
                const mockUrl = `https://picsum.photos/seed/${Math.random()}/400/800`;
                if (captureMode === 'single') {
                  setCapturedPreview(mockUrl);
                  setIsReviewing(true);
                }
                resolve(mockUrl);
              }, 500);
            });
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Mirror the image for the capture to match the preview
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const dataUrl = canvas.toDataURL('image/png');
          
          if (captureMode === 'multi') {
            setIsCapturing(false);
            return dataUrl;
          } else {
            setCapturedPreview(dataUrl);
            setIsCapturing(false);
            setIsReviewing(true);
            
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FF85B3', '#9D72FF', '#FFFFFF'],
            });
            return dataUrl;
          }
        }
      }
    } catch (error) {
      console.error("Capture error:", error);
    }

    // Fallback to mock if camera not available or error occurred
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsCapturing(false);
        const mockUrl = `https://picsum.photos/seed/${Math.random()}/400/800`;
        
        if (captureMode === 'single') {
          setCapturedPreview(mockUrl);
          setIsReviewing(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF85B3', '#9D72FF', '#FFFFFF'],
          });
        }
        
        resolve(mockUrl);
      }, 1000);
    });
  };

  const saveToGallery = async () => {
    if (!capturedPreview) return;
    
    // Show progress immediately
    setUploadProgress(1);
    
    try {
      const newImage = await storageService.uploadImage(
        capturedPreview,
        user?.id || '1',
        user?.name || 'User',
        id || 'room-1',
        (p) => setUploadProgress(p)
      );
      
      addImage(newImage);
      setIsReviewing(false);
      setUploadProgress(0);
      setCapturedPreview(null);
      setMultiCaptures([]);
      
      addMessage({
        id: Math.random().toString(),
        senderId: 'system',
        content: `${user?.name} vừa chụp một bức ảnh mới cùng cả nhóm! 📸`,
        type: 'system',
        timestamp: Date.now(),
      });
      
      setActiveTab('gallery');
    } catch (error: any) {
      alert(error.message);
      setUploadProgress(0);
    }
  };


  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 flex justify-between items-center glass border-none rounded-none bg-slate-900/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[user, ...mockUsers.slice(0, 2)].map((u, i) => (
                <div key={u?.id ? `header-user-${u.id}-${i}` : `header-user-idx-${i}`} className="relative">
                  <img 
                    src={u?.avatar} 
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                  {i === 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-slate-900">
                      <Sparkles className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                +1
              </div>
            </div>
            <div>
              <h2 className="font-bold text-sm">{activeRoom?.name || `Phòng của ${user?.name}`}</h2>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> 4 người đang online
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon className="w-5 h-5" />} />
          <TabButton active={activeTab === 'camera'} onClick={() => setActiveTab('camera')} icon={<Camera className="w-5 h-5" />} />
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare className="w-5 h-5" />} />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-screen">
        {/* Camera Area */}
        <div className={cn(
          "flex-1 relative bg-black overflow-hidden transition-all duration-500 min-h-[55vh] sm:min-h-[65vh] lg:min-h-full",
          activeTab !== 'camera' && "opacity-0 pointer-events-none absolute inset-0 z-0"
        )}>
          {uploadProgress > 0 && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 z-[60]">
              <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                <span>Đang tải lên...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-brand-purple"
                />
              </div>
            </div>
          )}

          <div className="relative z-10 flex h-full flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-stretch">
            <div className="flex-1 min-h-[60vh]">
              <SingleCaptureView 
                isLocal={true}
                videoRef={localVideoRef}
                selectedFilter={selectedFilter}
                selectedFrame={selectedFrame}
                countdown={countdown}
                isCapturing={isCapturing}
                capturedPreview={capturedPreview}
                isReviewing={isReviewing}
                onRetake={() => { setIsReviewing(false); setCapturedPreview(null); setMultiCaptures([]); }}
                onSave={saveToGallery}
                captureMode={captureMode}
                multiCaptures={multiCaptures}
                currentFrameIndex={currentFrameIndex}
              />
            </div>

            <div className="w-full lg:w-[320px] flex-shrink-0">
              <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-slate-950/75 p-4 shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Live preview</p>
                    <p className="text-sm font-semibold text-white">Captured frames</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{previewItems.length}/4</span>
                </div>

                <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                  {previewItems.length > 0 ? (
                    previewItems.map((src, index) => (
                      <div key={`${src}-${index}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 h-28">
                        <img src={src} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <button
                          onClick={() => setHiddenPreviewIndexes((prev) => [...prev, index])}
                          className="absolute top-3 right-3 z-20 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-4 text-center">
                      <p className="text-sm font-semibold text-white">Chưa có ảnh để xem</p>
                      <p className="text-xs text-slate-400 mt-2">Chụp vài khoảnh khắc để xem bản xem trước ở đây.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Canvas for Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Review Controls Overlay */}
          <AnimatePresence>
            {isReviewing && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 px-6 z-50"
              >
                <Button variant="glass" onClick={() => { setIsReviewing(false); setCapturedPreview(null); setMultiCaptures([]); }} className="flex-1 max-w-[160px] py-4 rounded-2xl">Chụp lại</Button>
                <Button onClick={saveToGallery} className="flex-1 max-w-[160px] py-4 rounded-2xl neon-glow">Lưu & Chia sẻ</Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Controls */}
          {!isReviewing && (
            <div className="absolute bottom-6 left-1/2 z-50 flex w-full max-w-4xl -translate-x-1/2 flex-col items-center gap-4 px-4 sm:px-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="glass rounded-3xl p-1 flex gap-1">
                  <button 
                    onClick={() => setCaptureMode('single')}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-[11px] font-semibold transition-all",
                      captureMode === 'single' ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
                    )}
                  >
                    1 FRAME
                  </button>
                  <button 
                    onClick={() => setCaptureMode('multi')}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-[11px] font-semibold transition-all",
                      captureMode === 'multi' ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
                    )}
                  >
                    4 FRAMES
                  </button>
                </div>

                <button
                  onClick={() => setAutoCaptureEnabled((prev) => !prev)}
                  className={cn(
                    "rounded-2xl border border-white/10 px-4 py-2 text-[11px] font-semibold transition",
                    autoCaptureEnabled ? 'bg-brand-purple text-white' : 'bg-white/5 text-white/70 hover:text-white'
                  )}
                >
                  {autoCaptureEnabled ? 'AUTO' : 'MANUAL'}
                </button>
              </div>

              <motion.button
                onClick={startCapture}
                disabled={countdown !== null}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative w-24 h-24 rounded-full bg-white p-1 shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50"
              >
                <div className="w-full h-full rounded-full border-4 border-brand-purple flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-brand-purple flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                {countdown === null && (
                  <motion.div 
                    animate={{ scale: [1, 1.16, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-2 border-2 border-white rounded-full pointer-events-none"
                  />
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="flex-1 glass border-none rounded-none flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Kỷ niệm trong phòng</h3>
                  <p className="text-xs text-slate-400 mt-1">Nơi lưu giữ những khoảnh khắc rực rỡ của nhóm</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-brand-purple">{images.length} ảnh</span>
                  <Button onClick={() => setActiveTab('camera')} size="sm" className="neon-glow">
                    <Camera className="w-4 h-4" />
                    Chụp ảnh mới
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                {images.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <ImageIcon className="w-10 h-10 text-slate-700" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Chưa có ảnh nào</h4>
                    <p className="text-sm text-slate-500 max-w-xs mb-8">Hãy là người đầu tiên ghi lại khoảnh khắc rực rỡ cùng bạn bè!</p>
                    <Button onClick={() => setActiveTab('camera')} className="px-8 py-6 rounded-2xl">
                      <Camera className="w-5 h-5" />
                      Mở Camera ngay
                    </Button>
                  </div>
                ) : (
                  <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {images.map((img) => (
                      <motion.div
                        key={img.id}
                        layoutId={img.id}
                        onClick={() => setSelectedImage(img)}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer group relative break-inside-avoid rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-slate-800"
                      >
                        <img src={img.url} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={user?.avatar} className="w-8 h-8 rounded-full border-2 border-white/20" referrerPolicy="no-referrer" />
                              <div>
                                <p className="text-xs font-bold text-white">{img.ownerName}</p>
                                <p className="text-[10px] text-white/60">{formatTime(img.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                              <Heart className="w-3 h-3 fill-brand-pink text-brand-pink" />
                              <span className="text-[10px] font-bold">{img.reactions.length}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="flex-1 glass border-none rounded-none flex flex-col"
            >
              <div className="p-4 border-b border-white/10 font-bold">Trò chuyện</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex flex-col",
                    msg.type === 'system' ? 'items-center' : (msg.senderId === user?.id ? 'items-end' : 'items-start')
                  )}>
                    {msg.type === 'system' ? (
                      <span className="text-[10px] text-slate-500 bg-white/5 px-3 py-1 rounded-full">{msg.content}</span>
                    ) : (
                      <div className="max-w-[80%]">
                        <div className={cn(
                          "p-3 rounded-2xl text-sm",
                          msg.senderId === user?.id ? 'bg-brand-purple text-white' : 'bg-white/10 text-white'
                        )}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">{formatTime(msg.timestamp)}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand-purple"
                />
                <Button type="submit" size="sm" className="px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={selectedImage.id}
              className="relative w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="flex justify-center">
                <div className="w-full max-w-sm aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border border-white/20">
                  <img src={selectedImage.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div className="flex flex-col">
                <GlassCard className="flex-1 flex flex-col p-6 bg-white/10 border-white/10 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg">Chụp bởi {selectedImage.ownerName}</h3>
                      <p className="text-xs text-slate-400">{new Date(selectedImage.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="glass" size="sm" onClick={() => { setEditingImage(selectedImage); setIsEditorOpen(true); }}>
                        <Wand2 className="w-4 h-4" />
                        Sửa
                      </Button>
                      <Button variant="glass" size="sm" onClick={() => setIsStoryModalOpen(true)}>
                        <Share2 className="w-4 h-4" />
                        Story
                      </Button>
                      <Button variant="glass" size="sm" onClick={() => setSelectedImage(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-hide">
                    <p className="text-sm text-slate-300 italic">"Kỷ niệm rực rỡ cùng hội bạn thân ✨"</p>
                    {/* Mock Comments */}
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-purple/20" />
                        <div>
                          <p className="text-xs font-bold">Hoàng Nam</p>
                          <p className="text-xs text-slate-300">Ảnh này đẹp quá mọi người ơi! 😍</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <button 
                      onClick={() => addReaction(selectedImage.id, { userId: user?.id || '1', emoji: '❤️' })}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Heart className={cn("w-5 h-5", selectedImage.reactions.length > 0 ? "fill-brand-pink text-brand-pink" : "text-white")} />
                      <span className="text-sm font-bold">{selectedImage.reactions.length}</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span className="text-sm font-bold">{selectedImage.commentsCount}</span>
                    </div>
                    <Button variant="glass" size="sm" className="ml-auto">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      placeholder="Viết bình luận..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-purple"
                    />
                    <Button size="sm">Gửi</Button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStoryModalOpen && selectedImage && (
          <StoryExportModal 
            image={selectedImage} 
            onClose={() => setIsStoryModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditorOpen && editingImage && (
          <PhotoEditorModal 
            image={editingImage} 
            onClose={() => setIsEditorOpen(false)} 
            onSave={(newUrl) => {
              updateImage(editingImage.id, newUrl);
              setSelectedImage(prev => prev ? { ...prev, url: newUrl } : null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: any }) => (
  <button
    onClick={onClick}
    className={cn(
      "p-3 rounded-2xl transition-all",
      active ? "bg-brand-purple text-white shadow-lg" : "text-slate-400 hover:bg-white/10"
    )}
  >
    {icon}
  </button>
);

const UserCamera = ({ user, isLocal, videoRef }: { user: any; isLocal?: boolean; videoRef?: React.RefObject<HTMLVideoElement | null> }) => {
  useEffect(() => {
    if (isLocal && videoRef?.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Camera error:", err);
        });
        
      return () => {
        // Cleanup stream
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isLocal, videoRef]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-700 aspect-square shadow-inner">
      {isLocal ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover scale-x-[-1]" 
        />
      ) : (
        <>
          <img src={user.avatar} className="w-full h-full object-cover opacity-50 blur-sm" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 p-1 bg-white/10 backdrop-blur-md">
              <img src={user.avatar} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </>
      )}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5">
        <div className={cn("w-1.5 h-1.5 rounded-full", isLocal ? "bg-green-500 animate-pulse" : "bg-slate-400")} />
        {user.name} {isLocal && '(Bạn)'}
      </div>
    </div>
  );
};

