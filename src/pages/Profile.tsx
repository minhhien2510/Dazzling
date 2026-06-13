import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Image, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../services/authService';

const Profile: React.FC = () => {
  const { user, logout, isInitializing } = useAuth();
  const navigate = useNavigate();

  if (isInitializing || !user) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Container className="py-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="glass-card p-5 border-0">
              <div className="text-center mb-5">
                <img
                  src={getAvatarUrl(user)}
                  alt={user.fullName}
                  className="rounded-circle border-4 border-primary-lavender bg-white p-1 mb-3 shadow-md"
                  width="120"
                  height="120"
                />
                <h2 className="fw-bold mb-1">{user.fullName}</h2>
                <p className="text-secondary-muted d-flex align-items-center justify-content-center gap-2 mb-2">
                  <Mail size={16} />
                  {user.email}
                </p>
                <Badge bg="secondary" className={user.role === 'ADMIN' ? 'bg-primary-lavender' : ''}>
                  {user.role}
                </Badge>
              </div>

              <div className="mb-4">
                <Link to="/gallery" className="btn btn-outline-lavender w-100 rounded-pill py-3 fw-bold text-decoration-none">
                  <Image size={18} className="me-2" />
                  Gallery của tôi
                </Link>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-10">
                <Button variant="link" className="text-secondary-muted text-decoration-none small">
                  <Settings size={16} className="me-2" />
                  Cài đặt tài khoản
                </Button>
                <Button
                  variant="link"
                  className="text-danger text-decoration-none small fw-bold"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-2" />
                  Đăng xuất
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Profile;
