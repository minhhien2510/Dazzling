import React from 'react';
import toast from 'react-hot-toast';
import { Eye, Send } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { AdminCard, EmptyState, ErrorState, LoadingSkeleton, StatusBadge, TypeBadge } from '../components/AdminUI';
import { useFeedbackDetail, useFeedbacks, useReplyFeedback, useUpdateFeedbackStatus } from '../hooks/useAdminQueries';
import type { FeedbackStatus } from '../../../types/admin';
import { getApiErrorMessage } from '../../../services/apiClient';

const statuses: Array<FeedbackStatus | 'ALL'> = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];
const updateStatuses: FeedbackStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

const formatDate = (value?: string) => (value ? new Date(value).toLocaleString('vi-VN') : '-');

const AdminFeedbacksPage: React.FC = () => {
  const [status, setStatus] = React.useState<FeedbackStatus | 'ALL'>('ALL');
  const [page, setPage] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState<number | undefined>();
  const [reply, setReply] = React.useState('');

  const feedbacks = useFeedbacks({ status, page, size: 10 });
  const detail = useFeedbackDetail(selectedId);
  const updateStatus = useUpdateFeedbackStatus();
  const replyFeedback = useReplyFeedback();

  const handleStatusChange = (next: FeedbackStatus | 'ALL') => {
    setStatus(next);
    setPage(0);
  };

  const handleUpdateStatus = async (nextStatus: FeedbackStatus) => {
    if (!selectedId) return;
    try {
      await updateStatus.mutateAsync({ id: selectedId, status: nextStatus });
      toast.success('C?p nh?t tr?ng thái thành công');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleReply = async () => {
    if (!selectedId || !reply.trim()) return;
    try {
      await replyFeedback.mutateAsync({ id: selectedId, message: reply.trim() });
      setReply('');
      toast.success('Ðã g?i ph?n h?i');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const data = feedbacks.data;
  const selected = detail.data;

  return (
    <AdminLayout title="Feedback Management" subtitle="Review, reply and resolve user feedback">
      <AdminCard className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black">Feedback Inbox</h2>
            <p className="text-sm text-slate-500">Filter by status and inspect each report.</p>
          </div>
          <select value={status} onChange={(event) => handleStatusChange(event.target.value as FeedbackStatus | 'ALL')} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-violet-400">
            {statuses.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All' : item}</option>)}
          </select>
        </div>
      </AdminCard>

      {feedbacks.isLoading && <LoadingSkeleton className="h-96" />}
      {feedbacks.isError && <ErrorState message={getApiErrorMessage(feedbacks.error)} />}
      {data && (
        <AdminCard>
          {data.content.length === 0 ? (
            <EmptyState title="Không có feedback" description="Feedback phù h?p filter s? hi?n th? t?i dây." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-3">ID</th>
                    <th className="px-3 py-3">Title</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">User ID</th>
                    <th className="px-3 py-3">Created At</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data.content.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.04]">
                      <td className="px-3 py-4 font-bold">#{item.id}</td>
                      <td className="px-3 py-4 font-semibold text-white">{item.title}</td>
                      <td className="px-3 py-4"><TypeBadge type={item.type} /></td>
                      <td className="px-3 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-3 py-4 text-slate-400">{item.userId}</td>
                      <td className="px-3 py-4 text-slate-400">{formatDate(item.createdAt)}</td>
                      <td className="px-3 py-4 text-right">
                        <button className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-950 hover:bg-violet-100" onClick={() => setSelectedId(item.id)}>
                          <Eye size={14} className="mr-1 inline" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">Page {data.number + 1} / {Math.max(data.totalPages, 1)} · {data.totalElements} feedbacks</p>
            <div className="flex gap-2">
              <button disabled={page <= 0} onClick={() => setPage((current) => Math.max(current - 1, 0))} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
              <button disabled={page + 1 >= data.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </div>
          </div>
        </AdminCard>
      )}

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={() => setSelectedId(undefined)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Feedback Detail</h2>
                <p className="text-sm text-slate-500">Update status and reply to the user.</p>
              </div>
              <button onClick={() => setSelectedId(undefined)} className="rounded-xl border border-white/10 px-3 py-2 text-slate-300">Close</button>
            </div>

            {detail.isLoading && <LoadingSkeleton className="h-80" />}
            {detail.isError && <ErrorState message={getApiErrorMessage(detail.error)} />}
            {selected && (
              <div className="space-y-6">
                <AdminCard>
                  <div className="flex flex-wrap items-center gap-2">
                    <TypeBadge type={selected.type} />
                    <StatusBadge status={selected.status} />
                    <span className="text-sm text-slate-500">User ID: {selected.userId}</span>
                    <span className="text-sm text-slate-500">{formatDate(selected.createdAt)}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black">{selected.title}</h3>
                  <p className="mt-3 whitespace-pre-wrap text-slate-300">{selected.content}</p>
                </AdminCard>

                <AdminCard>
                  <label className="text-sm font-bold text-slate-300">Update Status</label>
                  <select value={selected.status} onChange={(event) => handleUpdateStatus(event.target.value as FeedbackStatus)} disabled={updateStatus.isPending} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400">
                    {updateStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </AdminCard>

                <AdminCard>
                  <h3 className="mb-4 text-lg font-black">Replies Timeline</h3>
                  {selected.replies?.length ? (
                    <div className="space-y-4">
                      {selected.replies.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <p className="whitespace-pre-wrap text-slate-200">{item.message}</p>
                          <p className="mt-2 text-xs text-slate-500">{formatDate(item.createdAt)} · {item.adminId ? `Admin #${item.adminId}` : item.userId ? `User #${item.userId}` : 'System'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Chua có ph?n h?i" />
                  )}
                </AdminCard>

                <AdminCard>
                  <label className="text-sm font-bold text-slate-300">Reply</label>
                  <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={4} placeholder="Chúng tôi dang x? lý..." className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400" />
                  <button onClick={handleReply} disabled={replyFeedback.isPending || !reply.trim()} className="mt-3 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
                    <Send size={16} className="mr-2 inline" /> Reply
                  </button>
                </AdminCard>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFeedbacksPage;
