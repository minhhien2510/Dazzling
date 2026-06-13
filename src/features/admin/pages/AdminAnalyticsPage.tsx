import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminLayout from '../components/AdminLayout';
import { AdminCard, EmptyState, ErrorState, LoadingSkeleton } from '../components/AdminUI';
import { usePhotoStats, useSessionStats, useUserStats } from '../hooks/useAdminQueries';
import { getApiErrorMessage } from '../../../services/apiClient';

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 29);
  return { from: toDateInput(from), to: toDateInput(to) };
}

const ChartPanel: React.FC<{ title: string; children: React.ReactNode; loading?: boolean; empty?: boolean; error?: unknown }> = ({ title, children, loading, empty, error }) => (
  <AdminCard className="min-h-[380px]">
    <h2 className="mb-4 text-lg font-black text-white">{title}</h2>
    {loading && <LoadingSkeleton className="h-72" />}
    {error && <ErrorState message={getApiErrorMessage(error)} />}
    {!loading && !error && empty && <EmptyState title="Chua có d? li?u" description="Th? ch?n kho?ng th?i gian khác." />}
    {!loading && !error && !empty && <div className="h-72">{children}</div>}
  </AdminCard>
);

const AdminAnalyticsPage: React.FC = () => {
  const [range, setRange] = React.useState(defaultRange);
  const users = useUserStats(range);
  const sessions = useSessionStats(range);
  const photos = usePhotoStats(range);

  return (
    <AdminLayout title="Analytics" subtitle="User, session and photo trends">
      <AdminCard className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1 text-sm font-semibold text-slate-300">
            From
            <input type="date" value={range.from} onChange={(event) => setRange((current) => ({ ...current, from: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400" />
          </label>
          <label className="flex-1 text-sm font-semibold text-slate-300">
            To
            <input type="date" value={range.to} onChange={(event) => setRange((current) => ({ ...current, to: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400" />
          </label>
        </div>
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartPanel title="User Statistics" loading={users.isLoading} error={users.error} empty={!users.data?.length}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={users.data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
              <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Session Statistics" loading={sessions.isLoading} error={sessions.error} empty={!sessions.data?.length}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessions.data ?? []}>
              <defs><linearGradient id="sessions" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
              <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} fill="url(#sessions)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <div className="xl:col-span-2">
          <ChartPanel title="Photo Statistics" loading={photos.isLoading} error={photos.error} empty={!photos.data?.length}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={photos.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                <Bar dataKey="count" fill="#f472b6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
