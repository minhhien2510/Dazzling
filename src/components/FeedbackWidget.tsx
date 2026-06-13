import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FeedbackWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      toast('Vui lòng đăng nhập để gửi feedback.');
      navigate('/');
      return;
    }
    navigate('/feedback');
  };

  return (
    <button
      type="button"
      className="position-fixed d-flex align-items-center gap-2 border-0 shadow-lg"
      style={{
        right: 72,
        bottom: 24,
        zIndex: 1050,
        borderRadius: 999,
        padding: '12px 18px',
        background: 'linear-gradient(135deg, #c2410c, #f97316)',
        color: '#fff',
        fontWeight: 700,
      }}
      onClick={handleClick}
    >
      <MessageCircle size={18} />
      Gửi feedback
    </button>
  );
};

export default FeedbackWidget;
