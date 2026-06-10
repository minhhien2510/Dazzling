import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/apiClient';

const PASSWORD_RULES = [
  { id: 'length', label: 'Ít nhất 8 ký tự', test: (p: string) => p.length >= 8 },
  { id: 'upper', label: 'Một chữ hoa', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Một chữ thường', test: (p: string) => /[a-z]/.test(p) },
  { id: 'digit', label: 'Một chữ số', test: (p: string) => /\d/.test(p) },
  { id: 'special', label: 'Một ký tự đặc biệt', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  if (isInitializing) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const passwordValid = PASSWORD_RULES.every((rule) => rule.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordValid) {
      setError('Mật khẩu chưa đủ mạnh. Vui lòng kiểm tra các yêu cầu bên dưới.');
      return;
    }

    if (!passwordsMatch) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });
      navigate('/dashboard');
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
        <Card className="glass-card p-4 bg-white bg-opacity-70 border-0 shadow-sm">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold dazzle-text-gradient h1">Tạo tài khoản</h2>
              <p className="text-secondary-muted small">Tham gia cộng đồng Dazzling ngay hôm nay!</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2 small border-0 bg-opacity-25 bg-danger text-danger">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-dark">Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white"
                  autoComplete="name"
                  required
                  minLength={2}
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-dark">Mật khẩu</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="P@ssw0rd"
                    className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white pe-5"
                    autoComplete="new-password"
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
                {password.length > 0 && (
                  <ul className="list-unstyled small mt-2 mb-0">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <li
                          key={rule.id}
                          className={`d-flex align-items-center gap-1 ${passed ? 'text-success' : 'text-secondary-muted'}`}
                        >
                          <CheckCircle2 size={14} />
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-dark">Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white"
                  autoComplete="new-password"
                  required
                  isInvalid={confirmPassword.length > 0 && !passwordsMatch}
                />
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <Form.Control.Feedback type="invalid">Mật khẩu xác nhận không khớp</Form.Control.Feedback>
                )}
              </Form.Group>

              <Button
                type="submit"
                className="btn-dazzle w-100 py-3 mb-3 h5"
                disabled={loading || !passwordValid || !passwordsMatch}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang đăng ký...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="me-2 d-inline" />
                    Đăng ký
                  </>
                )}
              </Button>
            </Form>

            <div className="text-center mt-4 pt-2">
              <span className="small text-secondary-muted">Đã có tài khoản? </span>
              <Link to="/login" className="small text-primary-lavender text-decoration-none fw-bold">
                Đăng nhập
              </Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Register;
