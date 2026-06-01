import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shield, Sparkles, Gamepad2, Check } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { GlassCard } from '../../shared/ui/GlassCard';
import { cn } from '../../shared/utils';
import { useRoomStore } from '../stores/roomStore';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createRoom } = useRoomStore();

  const [name, setName] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'invite'>('private');
  const [maxMembers, setMaxMembers] = useState(4);
  const [theme, setTheme] = useState('classic');
  const [hasMiniGame, setHasMiniGame] = useState(true);

  const handleCreate = () => {
    if (!name.trim() || !user) return;

    const roomId = createRoom({
      name,
      privacy,
      maxMembers,
      theme,
      hasMiniGame
    }, user);

    onClose();
    navigate(`/room/${roomId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg"
      >
        <GlassCard className="p-8 bg-white/95 border-white shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
              Tạo phòng mới
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Tên phòng
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Hội chị em, Team công ty..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-slate-900 font-medium"
              />
            </div>

            {/* Privacy & Members */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Quyền riêng tư
                </label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  <button
                    onClick={() => setPrivacy('private')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                      privacy === 'private' ? "bg-white text-brand-purple shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Shield className="w-3 h-3" />
                    Riêng tư
                  </button>
                  <button
                    onClick={() => setPrivacy('invite')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                      privacy === 'invite' ? "bg-white text-brand-purple shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Users className="w-3 h-3" />
                    Mời
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Số người tối đa
                </label>
                <select
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  className="w-full bg-slate-100 border-none rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
                >
                  {[3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} người</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Chủ đề (Theme)
              </label>
              <div className="flex gap-3">
                {['classic', 'neon', 'warm', 'cyber'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex-1 py-3 rounded-2xl border-2 capitalize text-xs font-bold transition-all",
                      theme === t 
                        ? "border-brand-purple bg-brand-purple/5 text-brand-purple" 
                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Game Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Mini Games</p>
                  <p className="text-[10px] text-slate-500">Bật trò chơi tương tác trong phòng</p>
                </div>
              </div>
              <button
                onClick={() => setHasMiniGame(!hasMiniGame)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  hasMiniGame ? "bg-brand-purple" : "bg-slate-200"
                )}
              >
                <motion.div
                  animate={{ x: hasMiniGame ? 26 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <Button variant="glass" className="flex-1 py-4 border-slate-200 text-slate-600" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                className="flex-1 py-4 neon-glow" 
                onClick={handleCreate}
                disabled={!name.trim()}
              >
                Tạo & Vào phòng
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
