import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationPopupProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ show, onClose, title, message }) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <AnimatePresence>
        {show && (
          <motion.div
            key="notification-toast"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
          >
            <Toast onClose={onClose} show={show} delay={3000} autohide className="glass-card-light border-0 shadow-lg">
              <Toast.Header className="bg-transparent border-0">
                <div className="bg-primary bg-opacity-10 p-1 rounded-circle me-2">
                   <Bell size={16} className="text-primary" />
                </div>
                <strong className="me-auto">{title}</strong>
                <small>Just now</small>
              </Toast.Header>
              <Toast.Body className="small text-dark pb-3">{message}</Toast.Body>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContainer>
  );
};

export default NotificationPopup;
