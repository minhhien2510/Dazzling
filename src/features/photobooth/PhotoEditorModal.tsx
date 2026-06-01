import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Wand2, Type, Sticker, Palette, Download } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { GlassCard } from '../../shared/ui/GlassCard';
import { ImageAsset } from '../../types';
import { cn } from '../../shared/utils';

interface PhotoEditorModalProps {
  image: ImageAsset;
  onClose: () => void;
  onSave: (updatedUrl: string) => void;
}

export const PhotoEditorModal = ({ image, onClose, onSave }: PhotoEditorModalProps) => {
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate processing
    setTimeout(() => {
      // In a real app, we'd apply filters to the canvas and get a new data URL
      // Here we just simulate it by passing the same URL (or a modified one if we had a real backend)
      onSave(image.url);
      setIsSaving(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-[85vh] flex flex-col lg:flex-row gap-8"
      >
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-black/40 rounded-3xl overflow-hidden relative">
          <div className={cn(
            "photobooth-strip shadow-2xl transition-all duration-300",
            filter === 'sepia' && 'sepia',
            filter === 'grayscale' && 'grayscale',
            filter === 'vibrant' && 'saturate-150 brightness-110',
            filter === 'cool' && 'hue-rotate-180'
          )}
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%)`
          }}
          >
            <img src={image.url} className="w-full rounded-lg" referrerPolicy="no-referrer" />
          </div>

          {isSaving && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
              <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold">Đang lưu chỉnh sửa...</p>
            </div>
          )}
        </div>

        {/* Editing Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <GlassCard className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-brand-purple" />
                Chỉnh sửa ảnh
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Bộ lọc</h4>
              <div className="grid grid-cols-3 gap-3">
                {['none', 'sepia', 'grayscale', 'vibrant', 'cool', 'warm'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "p-2 rounded-xl border text-[10px] font-medium capitalize transition-all",
                      filter === f ? "bg-brand-purple border-brand-purple text-white" : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            {/* Adjustments */}
            <section className="space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Điều chỉnh</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] mb-2">
                    <span>Độ sáng</span>
                    <span>{brightness}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150" value={brightness} 
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-brand-purple"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-2">
                    <span>Độ tương phản</span>
                    <span>{contrast}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150" value={contrast} 
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-brand-purple"
                  />
                </div>
              </div>
            </section>

            {/* Tools */}
            <section className="grid grid-cols-2 gap-4">
              <ToolButton icon={<Type />} label="Văn bản" />
              <ToolButton icon={<Sticker />} label="Nhãn dán" />
              <ToolButton icon={<Palette />} label="Vẽ" />
              <ToolButton icon={<Download />} label="Tải về" />
            </section>

            <div className="mt-auto pt-6 flex gap-3">
              <Button variant="glass" className="flex-1" onClick={onClose}>Hủy</Button>
              <Button className="flex-1" onClick={handleSave}>
                <Check className="w-4 h-4" />
                Lưu lại
              </Button>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

const ToolButton = ({ icon, label }: { icon: any; label: string }) => (
  <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
    <span className="text-brand-purple">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
