import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { GlassCard } from '../../shared/ui/GlassCard';
import { authService } from '../../core/api/authService';
import { useAuthStore } from '../stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'minhanh@example.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(data.email);
      setAuth(user, token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-brand-pink/20 via-brand-bg to-brand-purple/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h2>
            <p className="text-slate-500">Đăng nhập để bắt đầu khoảnh khắc Dazzling</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-gap-6 flex flex-col gap-6">
            <Input
              label="Email"
              placeholder="name@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <button className="text-brand-purple font-semibold hover:underline">
              Đăng ký ngay
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
