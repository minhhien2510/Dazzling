import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginRequiredModalProps {
  show: boolean;
  onHide: () => void;
  message?: string;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  show,
  onHide,
  message = 'Bạn cần đăng nhập để lưu ảnh vào Gallery. Đăng nhập ngay?',
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onHide();
    navigate('/login', { state: { from: '/photobooth' } });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Yêu cầu đăng nhập</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-secondary-muted">{message}</Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="link" className="text-secondary-muted text-decoration-none" onClick={onHide}>
          Để sau
        </Button>
        <Button className="btn-dazzle px-4" onClick={handleLogin}>
          <LogIn size={16} className="me-2" />
          Đăng nhập
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRequiredModal;
