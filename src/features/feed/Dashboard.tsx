import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, LogOut, Camera, Calendar, Sparkles, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../../shared/ui/GlassCard';
import { Button } from '../../shared/ui/Button';
import { dataService } from '../../core/api/dataService';
import { useAuthStore } from '../stores/authStore';
import { useRoomStore } from '../stores/roomStore';
import { CreateRoomModal } from '../photobooth/CreateRoomModal';
import { mockUsers } from '../../mocks/data';
import { formatTime, cn } from '../../shared/utils';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { rooms } = useRoomStore();
  const navigate = useNavigate();
  const { data: feed } = useQuery({ queryKey: ['feed'], queryFn: dataService.getFeed });

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-brand-bg">
      <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      {/* Sidebar */}
      <aside className="w-20 md:w-64 fixed h-full glass z-40 flex flex-col p-4">
        <div className="hidden md:block text-2xl font-bold mb-10 px-4 bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
          DAZZLING
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <SidebarItem icon={<Camera />} label="Feed" active />
          <SidebarItem icon={<Calendar />} label="Kỷ niệm" onClick={() => navigate('/memories')} />
          <SidebarItem icon={<MapPin />} label="Tiệm Studio" onClick={() => navigate('/stores')} />
          <SidebarItem icon={<Search />} label="Khám phá" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 text-slate-500 hover:text-red-500 transition-colors"
        >
          <LogOut />
          <span className="hidden md:block font-medium">Đăng xuất</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Chào {user?.name}! 👋</h1>
            <p className="text-slate-500">Hôm nay bạn muốn chụp ảnh ở đâu?</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsCreateModalOpen(true)} className="neon-glow">
              <Plus className="w-5 h-5" />
              Tạo phòng
            </Button>
            <img src={user?.avatar} className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white" referrerPolicy="no-referrer" />
          </div>
        </header>

        {/* Stories */}
        <section className="mb-10 overflow-x-auto flex gap-6 pb-4 scrollbar-hide">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-brand-purple flex items-center justify-center bg-white cursor-pointer hover:bg-brand-purple/5 transition-colors">
              <Plus className="text-brand-purple" />
            </div>
            <span className="text-xs font-medium">Thêm tin</span>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-3xl p-1 border-2 border-brand-pink cursor-pointer">
                <img
                  src={`https://i.pravatar.cc/150?u=${i + 10}`}
                  className="w-full h-full rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs font-medium">User {i}</span>
            </div>
          ))}
        </section>

        {/* Active Rooms */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Phòng của bạn</h3>
            <Button variant="glass" size="sm">Xem tất cả</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard 
                key={room.id}
                title={room.name} 
                members={room.maxMembers} 
                lastActive={room.lastActive} 
                onClick={() => navigate(`/room/${room.id}`)} 
              />
            ))}
          </div>
        </section>

        {/* Feed & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {feed?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={item.userAvatar} className="w-10 h-10 rounded-xl" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-sm">{item.userName}</p>
                      <p className="text-[10px] text-slate-400">{formatTime(item.timestamp)}</p>
                    </div>
                  </div>
                  <div className="photobooth-strip mx-auto mb-4">
                    <img src={item.imageUrl} className="w-full rounded-lg" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                      <button className="text-brand-pink hover:scale-110 transition-transform">
                        ❤️ {item.likes}
                      </button>
                      <button className="text-slate-400 text-sm">💬 4</button>
                    </div>
                    <button className="text-slate-400">🔖</button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Stats / Profile Sidebar */}
          <div className="space-y-8">
            <GlassCard className="p-6 bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 border-none">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                Thống kê của bạn
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StatItem label="Phòng đã tạo" value="12" />
                <StatItem label="Ảnh đã chụp" value="48" />
                <StatItem label="Streak" value="5 ngày" />
                <StatItem label="MVP" value="3 lần" />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold mb-4">Bạn bè đang online</h3>
              <div className="space-y-4">
                {mockUsers.slice(1).map(u => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={u.avatar} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <span className="text-xs font-medium">{u.name}</span>
                    </div>
                    <Button variant="glass" size="sm" className="px-3 py-1 text-[10px]">Mời</Button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/50 p-3 rounded-2xl border border-white/40">
    <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">{label}</p>
    <p className="text-xl font-black text-brand-purple">{value}</p>
  </div>
);

interface RoomCardProps {
  title: string;
  members: number;
  lastActive: string;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ title, members, lastActive, onClick }) => (
  <GlassCard onClick={onClick} className="p-5 cursor-pointer hover:scale-[1.02] transition-transform group">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors">
        <Users className="w-6 h-6" />
      </div>
      <span className="text-[10px] text-slate-400 font-medium">{lastActive}</span>
    </div>
    <h4 className="font-bold mb-1">{title}</h4>
    <p className="text-xs text-slate-500">{members} thành viên</p>
    <div className="flex -space-x-2 mt-4">
      {[1, 2, 3].map(i => (
        <img key={i} src={`https://i.pravatar.cc/100?u=${i + 20}`} className="w-6 h-6 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
      ))}
      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
        +{members - 3}
      </div>
    </div>
  </GlassCard>
);

const SidebarItem = ({ icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 p-4 rounded-2xl transition-all',
      active ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-500 hover:bg-brand-purple/10'
    )}
  >
    {icon}
    <span className="hidden md:block font-medium">{label}</span>
  </button>
);
