import React from 'react';
import { Alert } from 'react-bootstrap';
import { Info } from 'lucide-react';

const GuestModeBanner: React.FC = () => (
  <Alert variant="warning" className="glass-card border-0 mb-4 d-flex align-items-start gap-2">
    <Info size={20} className="flex-shrink-0 mt-1" />
    <div className="small">
      <strong>Chế độ khách:</strong> Bạn đang sử dụng chế độ khách. Ảnh sẽ không được lưu sau khi rời trang.
      Hãy <strong>đăng nhập</strong> để lưu và quản lý ảnh của bạn.
    </div>
  </Alert>
);

export default GuestModeBanner;
