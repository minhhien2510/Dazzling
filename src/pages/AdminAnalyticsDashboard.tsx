import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Camera, Database, Image, Star, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Container } from 'react-bootstrap';
import { adminDashboardService } from '../services/adminDashboardService';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  DailyMetric,
  FeedbackItem,
  FeedbackStats,
  FunnelStep,
  OverviewStats,
  SessionStats,
  StorageStats,
  TopFrame,
} from '../types/adminAnalytics';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'];

interface DashboardState {
  overview: OverviewStats;
  funnel: FunnelStep[];
  photosByDay: DailyMetric[];
  topFrames: TopFrame[];
  feedbackStats: FeedbackStats;
  sessionStats: SessionStats;
  storageStats: StorageStats;
}

const emptyState: DashboardState = {
  overview: { activeUsers: 0, photosGenerated: 0, sessionsCreated: 0, averageRating: 0 },
  funnel: [],
  photosByDay: [],
  topFrames: [],
  feedbackStats: { averageRating: 0, totalFeedback: 0, distribution: [] },
  sessionStats: { created: 0, completed: 0, canceled: 0, averagePhotosPerSession: 0 },
  storageStats: { totalImages: 0, totalBytes: 0, averageBytesPerImage: 0 },
};

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

const MetricCard: React.FC<{ title: string; value: string; helper: string; icon: React.ReactNode }> = ({
  title,
  value,
  helper,
  icon,
}) => (
  <div className="glass-card p-4 border-0 h-100 bg-white bg-opacity-80 shadow-sm">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="small fw-bold text-secondary">{title}</span>
      <span className="rounded-4 p-2" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>
        {icon}
      </span>
    </div>
    <h3 className="fw-black mb-1 text-dark">{value}</h3>
    <p className="small text-secondary mb-0">{helper}</p>
  </div>
);

const Panel: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <section className="glass-card p-4 border-0 bg-white bg-opacity-80 shadow-sm h-100">
    <div className="mb-4">
      <h5 className="fw-bold mb-1 text-dark">{title}</h5>
      {subtitle && <p className="small text-secondary mb-0">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const AdminAnalyticsDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>(emptyState);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [overview, funnel, photosByDay, topFrames, feedbackStats, sessionStats, storageStats] =
          await Promise.all([
            adminDashboardService.getOverview(),
            adminDashboardService.getFunnel(),
            adminDashboardService.getPhotosByDay(),
            adminDashboardService.getTopFrames(),
            adminDashboardService.getFeedbackStats(),
            adminDashboardService.getSessionStats(),
            adminDashboardService.getStorageStats(),
          ]);
        setState({ overview, funnel, photosByDay, topFrames, feedbackStats, sessionStats, storageStats });
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const page = await adminDashboardService.getFeedback(ratingFilter);
        setFeedbackItems(page.content);
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    };

    loadFeedback();
  }, [ratingFilter]);

  const ratingChartData = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((rating) => {
        const found = state.feedbackStats.distribution.find((item) => item.rating === rating);
        return { rating: `${rating} sao`, count: found?.count ?? 0 };
      }),
    [state.feedbackStats.distribution],
  );

  const sessionChartData = [
    { name: 'Created', value: state.sessionStats.created },
    { name: 'Completed', value: state.sessionStats.completed },
    { name: 'Canceled', value: state.sessionStats.canceled },
  ];

  const maxFunnel = Math.max(...state.funnel.map((step) => step.count), 1);

  return (
    <div style={{ background: 'linear-gradient(135deg, #fff7ed, #f8fafc)', minHeight: '100vh' }}>
      <Container fluid className="py-4" style={{ maxWidth: 1440 }}>
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <p className="small fw-bold text-uppercase mb-2" style={{ color: '#f97316', letterSpacing: '0.18em' }}>
              Product Analytics
            </p>
            <h1 className="display-6 fw-black text-dark mb-2">Admin Dashboard</h1>
            <p className="text-secondary mb-0">Tracking hành vi người dùng, feedback, funnel, session và storage.</p>
          </div>
          {isLoading && <span className="small fw-bold" style={{ color: '#f97316' }}>Đang tải dữ liệu...</span>}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6 col-xl-3">
            <MetricCard title="Active Users" value={state.overview.activeUsers.toLocaleString()} helper="Có event trong 30 ngày" icon={<Users size={20} />} />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard title="Photos Generated" value={state.overview.photosGenerated.toLocaleString()} helper="Ảnh đã lưu Gallery" icon={<Image size={20} />} />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard title="Sessions Created" value={state.overview.sessionsCreated.toLocaleString()} helper="Tổng photobooth sessions" icon={<Camera size={20} />} />
          </div>
          <div className="col-md-6 col-xl-3">
            <MetricCard title="Average Rating" value={state.overview.averageRating.toFixed(2)} helper="Điểm feedback trung bình" icon={<Star size={20} />} />
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-xl-4">
            <Panel title="Conversion Funnel" subtitle="Visit Home -> Open Camera -> Take Photo -> Download Photo">
              <div className="d-flex flex-column gap-3">
                {state.funnel.map((step) => (
                  <div key={step.eventType}>
                    <div className="d-flex justify-content-between small mb-2">
                      <strong>{step.label}</strong>
                      <span className="text-secondary">{step.count.toLocaleString()} · {step.conversionRate}%</span>
                    </div>
                    <div className="rounded-pill overflow-hidden" style={{ height: 10, background: '#fed7aa' }}>
                      <div
                        className="h-100 rounded-pill"
                        style={{
                          width: `${Math.max((step.count / maxFunnel) * 100, step.count > 0 ? 6 : 0)}%`,
                          background: 'linear-gradient(90deg, #f97316, #ec4899)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="col-xl-8">
            <Panel title="Photos Generated By Day" subtitle="Số ảnh Gallery được tạo theo ngày">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={state.photosByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-xl-4">
            <Panel title="Top Frames Used" subtitle="Từ metadata event USE_FRAME">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Frame</th>
                      <th className="text-end">Uses</th>
                      <th className="text-end">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.topFrames.map((frame) => (
                      <tr key={frame.frameId ?? frame.frameName}>
                        <td className="fw-semibold">{frame.frameName}</td>
                        <td className="text-end">{frame.usageCount.toLocaleString()}</td>
                        <td className="text-end">{frame.usageRate}%</td>
                      </tr>
                    ))}
                    {state.topFrames.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-secondary py-4">Chưa có dữ liệu frame.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <div className="col-xl-4">
            <Panel title="Feedback Analytics" subtitle={`${state.feedbackStats.totalFeedback.toLocaleString()} lượt feedback`}>
              <div className="text-center mb-3">
                <div className="display-4 fw-black" style={{ color: '#f97316' }}>{state.feedbackStats.averageRating.toFixed(2)}</div>
                <div className="small text-secondary">Average Rating</div>
              </div>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingChartData}>
                    <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="col-xl-4">
            <Panel title="Session & Storage" subtitle="Session, ảnh trung bình và MinIO usage">
              <div className="row g-3">
                <div className="col-6">
                  <div style={{ height: 170 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sessionChartData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={70} paddingAngle={3}>
                          {sessionChartData.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="col-6 small">
                  <p>Created: <strong>{state.sessionStats.created.toLocaleString()}</strong></p>
                  <p>Completed: <strong>{state.sessionStats.completed.toLocaleString()}</strong></p>
                  <p>Avg photos/session: <strong>{state.sessionStats.averagePhotosPerSession.toFixed(2)}</strong></p>
                </div>
              </div>
              <hr />
              <div className="row g-2 small">
                <div className="col-4"><strong>{state.storageStats.totalImages}</strong><br />Images</div>
                <div className="col-4"><strong>{formatBytes(state.storageStats.totalBytes)}</strong><br />Used</div>
                <div className="col-4"><strong>{formatBytes(state.storageStats.averageBytesPerImage)}</strong><br />Avg</div>
              </div>
            </Panel>
          </div>
        </div>

        <Panel title="Feedback Inbox" subtitle="Admin xem feedback và lọc theo rating">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button type="button" className={`btn btn-sm ${ratingFilter === undefined ? 'btn-warning text-white' : 'btn-light'}`} onClick={() => setRatingFilter(undefined)}>Tất cả</button>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button key={rating} type="button" className={`btn btn-sm ${ratingFilter === rating ? 'btn-warning text-white' : 'btn-light'}`} onClick={() => setRatingFilter(rating)}>
                {rating} sao
              </button>
            ))}
          </div>
          <div className="row g-3">
            {feedbackItems.map((feedback) => (
              <div key={feedback.id} className="col-md-6 col-xl-4">
                <article className="border rounded-4 p-3 h-100 bg-white">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold text-warning">{'★'.repeat(feedback.rating)}</span>
                    <span className="small text-secondary">{new Date(feedback.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="small mb-3">{feedback.content || 'Không có nội dung.'}</p>
                  <p className="small text-secondary mb-0">User ID: {feedback.userId ?? 'Guest'}</p>
                </article>
              </div>
            ))}
            {feedbackItems.length === 0 && <div className="col-12 text-center text-secondary py-4">Chưa có feedback.</div>}
          </div>
        </Panel>
      </Container>
    </div>
  );
};

export default AdminAnalyticsDashboard;
