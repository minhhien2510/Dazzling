import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Users, Sparkles, Heart, ArrowRight, Star, CheckCircle2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui/Button';
import { GlassCard } from '../../shared/ui/GlassCard';

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen bg-brand-bg selection:bg-brand-purple/30 selection:text-brand-purple">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-pink/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-yellow-200/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass px-6 py-3 rounded-full border-white/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-pink to-brand-purple rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
              DAZZLING
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-purple transition-colors">Tính năng</a>
            <a href="#how-it-works" className="hover:text-brand-purple transition-colors">Cách hoạt động</a>
            <a href="#community" className="hover:text-brand-purple transition-colors">Cộng đồng</a>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="glass" size="sm" className="hidden sm:flex">Đăng nhập</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="shadow-brand-purple/20">Bắt đầu ngay</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold mb-6 border border-brand-purple/20">
              <Sparkles className="w-3 h-3" />
              <span>NỀN TẢNG PHOTOBOOTH ONLINE SỐ 1 VN</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tight text-slate-900">
              Biến mọi khoảnh khắc thành <br />
              <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-brand-pink bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                Tuyệt tác.
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
              Dazzling mang cả trải nghiệm Photobooth Hàn Quốc về ngay chiếc điện thoại của bạn. Chụp ảnh nhóm, chơi game và kết nối không giới hạn.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="neon-glow group">
                  <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Tạo phòng chụp ngay
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="lg">
                <Play className="w-5 h-5 fill-current" />
                Xem demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">10,000+</span> bạn trẻ đang tham gia
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <motion.div style={{ y: y1 }} className="space-y-4">
                <PhotoCard src="https://picsum.photos/seed/d1/400/600" tag="#Besties" />
                <PhotoCard src="https://picsum.photos/seed/d2/400/600" tag="#SummerVibe" />
              </motion.div>
              <motion.div style={{ y: y2 }} className="space-y-4 pt-20">
                <PhotoCard src="https://picsum.photos/seed/d3/400/600" tag="#Dazzling" />
                <PhotoCard src="https://picsum.photos/seed/d4/400/600" tag="#NightOut" />
              </motion.div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="py-10 bg-white border-y border-slate-100 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-12 mx-12">
              <span className="text-2xl font-black text-slate-200 uppercase tracking-widest">Photobooth Online</span>
              <Sparkles className="text-brand-purple w-6 h-6" />
              <span className="text-2xl font-black text-slate-200 uppercase tracking-widest">Mini Games</span>
              <Heart className="text-brand-pink w-6 h-6" />
              <span className="text-2xl font-black text-slate-200 uppercase tracking-widest">Social Connect</span>
              <Camera className="text-brand-purple w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Tại sao chọn Dazzling?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Chúng tôi mang đến trải nghiệm chụp ảnh nhóm hoàn hảo nhất với công nghệ realtime và hàng ngàn nội dung sáng tạo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Camera className="w-8 h-8 text-brand-pink" />}
              title="Filter Độc Quyền"
              desc="Hơn 500+ bộ lọc màu và sticker được thiết kế riêng bởi các nghệ sĩ hàng đầu."
              color="bg-brand-pink/10"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-brand-purple" />}
              title="Phòng Chờ 8 Người"
              desc="Mời tối đa 8 người bạn vào cùng một phòng chụp, trò chuyện video chất lượng cao."
              color="bg-brand-purple/10"
            />
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-yellow-500" />}
              title="Thử Thách Nhóm"
              desc="Tham gia các mini game trong khi chờ đợi để nhận được các frame ảnh giới hạn."
              color="bg-yellow-100"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-brand-purple rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-pink rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-12 leading-tight">
                Chỉ 3 bước để có <br />
                <span className="text-brand-pink">bức ảnh để đời</span>
              </h2>
              <div className="space-y-10">
                <StepItem number="01" title="Tạo phòng & Mời bạn" desc="Chỉ mất 2 giây để tạo một phòng chụp riêng tư và gửi link cho hội bạn thân." />
                <StepItem number="02" title="Chọn Filter & Frame" desc="Khám phá kho tàng hiệu ứng khổng lồ, từ phong cách Y2K đến Minimalist." />
                <StepItem number="03" title="Chụp & Chia sẻ" desc="Bấm nút và nhận ngay dải ảnh Photobooth cực chất để khoe lên mạng xã hội." />
              </div>
            </div>
            <div className="relative">
              <GlassCard className="bg-white/10 border-white/10 p-2 overflow-hidden rotate-3">
                <img src="https://picsum.photos/seed/app-preview/800/1000" className="rounded-2xl shadow-2xl" referrerPolicy="no-referrer" />
              </GlassCard>
              <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl text-slate-900 max-w-[200px] -rotate-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <span className="font-bold text-sm">Đã lưu!</span>
                </div>
                <p className="text-xs text-slate-500">Ảnh đã được lưu vào bộ sưu tập của bạn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Feed Preview */}
      <section id="community" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Cộng đồng Dazzling</h2>
          <p className="text-slate-500">Những khoảnh khắc rực rỡ được chia sẻ mỗi ngày</p>
        </div>
        
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid"
            >
              <GlassCard className="p-2">
                <img 
                  src={`https://picsum.photos/seed/feed-${i}/400/${i % 2 === 0 ? 600 : 400}`} 
                  className="w-full rounded-2xl mb-3" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-2">
                    <img src={`https://i.pravatar.cc/50?u=${i}`} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                    <span className="text-[10px] font-bold">User_{i}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-brand-pink">
                    <Heart className="w-3 h-3 fill-current" />
                    {Math.floor(Math.random() * 100)}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <GlassCard className="max-w-5xl mx-auto bg-gradient-to-br from-brand-pink to-brand-purple p-12 md:p-20 text-center text-white border-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <Sparkles className="absolute top-10 left-10 w-20 h-20 animate-pulse" />
            <Camera className="absolute bottom-10 right-10 w-20 h-20 animate-bounce" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">Sẵn sàng để tỏa sáng?</h2>
          <p className="text-xl text-white/80 mb-12 max-w-xl mx-auto relative z-10">
            Tham gia cùng hàng ngàn người dùng khác và bắt đầu lưu giữ những kỷ niệm đẹp nhất ngay hôm nay.
          </p>
          <Link to="/login" className="relative z-10">
            <Button size="lg" className="bg-white text-brand-purple hover:bg-slate-100 px-12">
              Bắt đầu miễn phí
            </Button>
          </Link>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-pink to-brand-purple rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">DAZZLING</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Nền tảng Photobooth Online hàng đầu Việt Nam. Kết nối bạn bè qua những khung hình rực rỡ.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Sản phẩm</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-brand-purple">Tính năng</a></li>
              <li><a href="#" className="hover:text-brand-purple">Bộ lọc mới</a></li>
              <li><a href="#" className="hover:text-brand-purple">Mini Games</a></li>
              <li><a href="#" className="hover:text-brand-purple">Bảng giá</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Công ty</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-brand-purple">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-brand-purple">Blog</a></li>
              <li><a href="#" className="hover:text-brand-purple">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-brand-purple">Liên hệ</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 Dazzling Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-purple">Điều khoản</a>
            <a href="#" className="hover:text-brand-purple">Bảo mật</a>
            <a href="#" className="hover:text-brand-purple">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PhotoCard = ({ src, tag }: { src: string; tag: string }) => (
  <GlassCard className="p-2 group cursor-pointer overflow-hidden">
    <div className="relative overflow-hidden rounded-2xl">
      <img 
        src={src} 
        className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" 
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="text-white text-xs font-bold">{tag}</span>
      </div>
    </div>
  </GlassCard>
);

const FeatureCard = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) => (
  <GlassCard className="p-10 flex flex-col items-center text-center group">
    <div className={`w-20 h-20 rounded-3xl ${color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </GlassCard>
);

const StepItem = ({ number, title, desc }: { number: string; title: string; desc: string }) => (
  <div className="flex gap-6">
    <span className="text-3xl font-black text-brand-pink/30">{number}</span>
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);
