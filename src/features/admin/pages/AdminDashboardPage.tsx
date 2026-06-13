import React from 'react';
import { Camera, Database, Image, MessageSquareWarning, Users } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { AdminCard, ErrorState, LoadingSkeleton } from '../components/AdminUI';
import { useDashboard } from '../hooks/useAdminQueries';
import { getApiErrorMessage } from '../../../services/apiClient';

const numberFormat = new Intl.NumberFormat('vi-VN');

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; helper?: string }> = ({ title, value, icon, helper }) => (
  <AdminCard className="transition hover:-translate-y-1 hover:bg-white/[0.09]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-black tracking-tight text-white">{typeof value === 'number' ? numberFormat.format(value) : value}</p>
        {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 p-3 text-violet-100">{icon}</div>
    </div>
  </AdminCard>
);

const AdminDashboardPage: React.FC = () => {
  const { data, isLoading, isError, error } = useDashboard();

  return (
    <AdminLayout title="Dashboard" subtitle="Overview metrics for Dazzling Photobooth">
      {isLoading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 10 }).map((_, index) => <LoadingSkeleton key={index} />)}</div>}
      {isError && <ErrorState message={getApiErrorMessage(error)} />}
      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Total Users" value={data.totalUsers} helper="All registered users" icon={<Users size={24} />} />
            <StatCard title="Active Today" value={data.activeUsersToday} helper="Users active today" icon={<Users size={24} />} />
            <StatCard title="New Today" value={data.newUsersToday} helper="New signups today" icon={<Users size={24} />} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Sessions" value={data.totalSessions} helper="Photobooth sessions" icon={<Camera size={24} />} />
            <StatCard title="Sessions Today" value={data.sessionsToday} helper="Created today" icon={<Camera size={24} />} />
            <StatCard title="Total Photos" value={data.totalPhotos} helper="Gallery images" icon={<Image size={24} />} />
            <StatCard title="Photos Today" value={data.photosToday} helper="Saved today" icon={<Image size={24} />} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StatCard title="Storage Used MB" value={`${numberFormat.format(Number(data.storageUsedMB.toFixed(2)))} MB`} helper="Object storage usage" icon={<Database size={24} />} />
            <StatCard title="Open Feedbacks" value={data.openFeedbacks} helper="Needs admin attention" icon={<MessageSquareWarning size={24} />} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
