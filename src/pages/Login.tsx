import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/apiClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithCredentials, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  if (isInitializing) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginWithCredentials({ email: email.trim(), password });
      navigate(redirectTo);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-100"
        style={{ maxWidth: '450px' }}
      >
        <Card className="glass-card p-4">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold dazzle-text-gradient h1">Chào mừng trở lại</h2>
              <p className="text-secondary-muted small">Sẵn sàng cho buổi chụp ảnh tiếp theo?</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2 small border-0 bg-opacity-25 bg-danger text-danger">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-dark">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white"
                  autoComplete="email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-dark">Mật khẩu</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white pe-5"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary-muted p-0 me-3"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Form.Group>

              <Button type="submit" className="btn-dazzle w-100 py-3 mb-3 h5" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="me-2 d-inline" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </Form>

            <div className="text-center mt-4 pt-2">
              <span className="small text-secondary-muted">Chưa có tài khoản? </span>
              <Link to="/register" className="small text-primary-lavender text-decoration-none fw-bold">
                Đăng ký ngay
              </Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Login;
