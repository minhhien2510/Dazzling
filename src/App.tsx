import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import { GalleryProvider } from './context/GalleryContext';
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FeedbackWidget from './components/FeedbackWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Photobooth from './pages/Photobooth';
import Moments from './pages/Moments';
import Stores from './pages/Stores';
import About from './pages/About';
import Chat from './pages/Chat';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminAnalyticsPage from './features/admin/pages/AdminAnalyticsPage';
import AdminFeedbacksPage from './features/admin/pages/AdminFeedbacksPage';
import FeedbackPage from './features/feedback/pages/FeedbackPage';

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminRoute && <Navigation />}
      <main style={{ paddingTop: isAdminRoute ? 0 : '80px', minHeight: isAdminRoute ? '100vh' : 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/photobooth" element={<Photobooth />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedbacks"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminFeedbacksPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FeedbackWidget />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionProvider>
          <GalleryProvider>
            <Router>
              <AppShell />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.95)',
                    color: '#2f2a2e',
                  },
                }}
              />
            </Router>
          </GalleryProvider>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
