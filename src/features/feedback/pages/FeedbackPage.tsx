import React from 'react';
import toast from 'react-hot-toast';
import { MessageSquarePlus } from 'lucide-react';
import { useCreateFeedback, useMyFeedbacks } from '../hooks/useFeedbackQueries';
import type { FeedbackType } from '../../../types/admin';
import type { MyFeedbackItem } from '../../../types/feedback';
import { getApiErrorMessage } from '../../../services/apiClient';
import { EmptyState, ErrorState, LoadingSkeleton, StatusBadge, TypeBadge } from '../../admin/components/AdminUI';

const feedbackTypes: FeedbackType[] = ['BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER'];
const formatDate = (value?: string) => (value ? new Date(value).toLocaleString('vi-VN') : '-');

const FeedbackPage: React.FC = () => {
  const [form, setForm] = React.useState({ title: '', content: '', type: 'BUG' as FeedbackType });
  const [selected, setSelected] = React.useState<MyFeedbackItem | null>(null);
  const myFeedbacks = useMyFeedbacks();
  const createFeedback = useCreateFeedback();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Vui lòng nh?p tiêu d? và n?i dung.');
      return;
    }

    try {
      await createFeedback.mutateAsync({ title: form.title.trim(), content: form.content.trim(), type: form.type });
      setForm({ title: '', content: '', type: 'BUG' });
      toast.success('G?i feedback thành công');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">Feedback Center</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">G?i feedback cho Dazzling</h1>
          <p className="mt-2 text-slate-400">Báo l?i, d? xu?t tính nang ho?c chia s? c?i ti?n b?n mu?n th?y.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/20 p-3 text-violet-200"><MessageSquarePlus size={22} /></div>
              <div>
                <h2 className="text-xl font-black">Create Feedback</h2>
                <p className="text-sm text-slate-500">Title và content là b?t bu?c.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-bold text-slate-300">
                Title
                <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-400" placeholder="Upload b? l?i" />
              </label>
              <label className="block text-sm font-bold text-slate-300">
                Type
                <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as FeedbackType }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-400">
                  {feedbackTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold text-slate-300">
                Content
                <textarea value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} rows={6} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-400" placeholder="?nh upload xong không hi?n th?" />
              </label>
              <button disabled={createFeedback.isPending} className="w-full rounded-2xl bg-white px-5 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
                {createFeedback.isPending ? 'Ðang g?i...' : 'G?i feedback'}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-black">My Feedbacks</h2>
            {myFeedbacks.isLoading && <LoadingSkeleton className="h-72" />}
            {myFeedbacks.isError && <ErrorState message={getApiErrorMessage(myFeedbacks.error)} />}
            {myFeedbacks.data && (myFeedbacks.data.length === 0 ? (
              <EmptyState title="B?n chua g?i feedback" description="Feedback dã g?i s? xu?t hi?n t?i dây." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myFeedbacks.data.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item)} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-left transition hover:-translate-y-1 hover:border-violet-400/60">
                    <div className="mb-3 flex flex-wrap gap-2"><TypeBadge type={item.type} /><StatusBadge status={item.status} /></div>
                    <h3 className="font-black text-white">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{item.content}</p>
                    <p className="mt-4 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                  </button>
                ))}
              </div>
            ))}
          </section>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{selected.title}</h2>
                <p className="text-sm text-slate-500">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-xl border border-white/10 px-3 py-2 text-slate-300">Close</button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2"><TypeBadge type={selected.type} /><StatusBadge status={selected.status} /></div>
            <p className="whitespace-pre-wrap text-slate-300">{selected.content}</p>
            <h3 className="mt-8 text-lg font-black">Replies from Admin</h3>
            <div className="mt-4 space-y-3">
              {selected.replies?.length ? selected.replies.map((reply) => (
                <div key={reply.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="whitespace-pre-wrap text-slate-200">{reply.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(reply.createdAt)}</p>
                </div>
              )) : <EmptyState title="Chua có ph?n h?i t? admin" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
