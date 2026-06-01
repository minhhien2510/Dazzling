import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Instagram, Copy, Sparkles, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { GlassCard } from '../../shared/ui/GlassCard';
import { ImageAsset } from '../../types';
import { formatTime } from '../../shared/utils';

interface StoryExportModalProps {
  image: ImageAsset;
  onClose: () => void;
}

export const StoryExportModal: React.FC<StoryExportModalProps> = ({ image, onClose }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Đã tải xuống Story của bạn!');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl grid md:grid-cols-2 gap-8"
      >
        {/* Story Preview (9:16) */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[320px] aspect-[9/16] bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 to-brand-pink/20" />
            
            {/* Image Content */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div 
                initial={{ rotate: -2, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/20"
              >
                <img src={image.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                
                {/* Neon Caption Overlay */}
                <div className="absolute bottom-6 left-0 right-0 px-4">
                  <p className="text-white font-bold text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-lg italic">
                    ✨ Besties Forever ✨
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Stickers */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-12 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl rotate-[-4deg]"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Dazzling Room</span>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-20 right-6 bg-brand-purple/20 backdrop-blur-md border border-brand-purple/30 p-4 rounded-[24px] rotate-6 shadow-2xl max-w-[150px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-brand-pink" />
                <span className="text-[10px] font-bold text-white">{new Date(image.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <p className="text-[10px] text-white/80 font-medium leading-relaxed">
                Khoảnh khắc rực rỡ cùng hội bạn thân tại Photobooth! 📸
              </p>
            </motion.div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span className="text-[8px] font-bold text-white tracking-[0.2em] uppercase">Made with Dazzling</span>
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Export Controls */}
        <div className="flex flex-col justify-center">
          <GlassCard className="p-8 bg-white/10 border-white/20 text-white">
            <h2 className="text-3xl font-bold mb-2">Tạo Story ✨</h2>
            <p className="text-slate-400 mb-8">Tùy chỉnh và chia sẻ dải ảnh của bạn lên Instagram hoặc TikTok.</p>
            
            <div className="space-y-4">
              <Button onClick={handleExport} className="w-full py-4 text-lg" disabled={isExporting}>
                <Download className="w-5 h-5" />
                {isExporting ? 'Đang xuất ảnh...' : 'Tải xuống Story'}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="glass" className="w-full">
                  <Instagram className="w-5 h-5 text-brand-pink" />
                  Instagram
                </Button>
                <Button variant="glass" className="w-full">
                  <Copy className="w-5 h-5 text-brand-purple" />
                  Sao chép link
                </Button>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Mẹo nhỏ
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sử dụng các frame ảnh giới hạn từ Mini Games để làm cho Story của bạn trở nên độc đáo hơn!
              </p>
            </div>
          </GlassCard>
        </div>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </motion.div>
    </div>
  );
};
