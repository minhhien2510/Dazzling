import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Filter, Grid, List, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../shared/ui/GlassCard';
import { Button } from '../../shared/ui/Button';
import { useImageStore } from '../stores/imageStore';
import { formatTime } from '../../shared/utils';

export const MemoriesPage = () => {
  const navigate = useNavigate();
  const { images } = useImageStore();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg p-6 md:p-10">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-white rounded-2xl transition-colors shadow-sm">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Kỷ niệm rực rỡ ✨</h1>
            <p className="text-slate-500">Nơi lưu giữ mọi khoảnh khắc Dazzling của bạn</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Tìm kiếm kỷ niệm..."
              className="pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-100 outline-none focus:border-brand-purple w-full md:w-64"
            />
          </div>
          <Button variant="glass" className="p-3">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/50 rounded-3xl p-3 aspect-[3/4] mb-4" />
                <div className="h-4 bg-white/50 rounded-full w-1/2 mb-2" />
                <div className="h-3 bg-white/50 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Chưa có kỷ niệm nào</h3>
            <p className="text-slate-500 mt-2">Hãy bắt đầu chụp ảnh cùng bạn bè để tạo nên những kỷ niệm đầu tiên!</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-8">
              Khám phá ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-3 group cursor-pointer">
                  <div className="photobooth-strip mx-auto mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                    <img src={image.url} className="w-full rounded-lg" referrerPolicy="no-referrer" />
                  </div>
                  <div className="px-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">
                        {new Date(image.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatTime(image.createdAt)}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 truncate">Chụp bởi {image.ownerName}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
