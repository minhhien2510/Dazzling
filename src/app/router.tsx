import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../features/auth/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { Dashboard } from '../features/feed/Dashboard';
import { PhotoboothRoom } from '../features/photobooth/PhotoboothRoom';
import { StoreFinder } from '../features/group/StoreFinder';
import { MemoriesPage } from '../features/feed/MemoriesPage';
import { useAuthStore } from '../features/stores/authStore';

export const AppRouter = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/memories"
        element={user ? <MemoriesPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/room/:id"
        element={<PhotoboothRoom />}
      />
      <Route
        path="/stores"
        element={user ? <StoreFinder /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};
