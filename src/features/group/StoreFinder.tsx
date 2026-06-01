import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Heart, Navigation, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../shared/ui/GlassCard';
import { Button } from '../../shared/ui/Button';
import { dataService } from '../../core/api/dataService';

export const StoreFinder = () => {
  const navigate = useNavigate();
  const { data: stores } = useQuery({ queryKey: ['stores'], queryFn: dataService.getStores });

  return (
    <div className="min-h-screen bg-brand-bg p-6 md:p-10">
      <header className="max-w-6xl mx-auto mb-10 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white rounded-xl transition-colors">
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Tiệm Photobooth gần bạn</h1>
          <p className="text-slate-500">Tìm kiếm địa điểm chụp ảnh offline cực chất</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* List */}
        <div className="space-y-6">
          {stores?.map((store) => (
            <GlassCard key={store.id} className="p-4 flex gap-6">
              <img src={store.image} className="w-32 h-32 rounded-2xl object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{store.name}</h3>
                  <button className="text-slate-300 hover:text-brand-pink transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{store.rating}</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-3 h-3" /> {store.address}
                </p>
                <div className="flex gap-2">
                  {store.style.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-1 bg-brand-purple/10 text-brand-purple rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Mock Map */}
        <div className="hidden md:block sticky top-10 h-[600px]">
          <GlassCard className="h-full p-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-brand-purple mx-auto mb-4 animate-bounce" />
                <p className="font-bold text-slate-400">Bản đồ đang tải...</p>
              </div>
            </div>
            {/* Markers */}
            <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-brand-purple rounded-full border-2 border-white shadow-lg cursor-pointer" />
            <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-brand-purple rounded-full border-2 border-white shadow-lg cursor-pointer" />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
