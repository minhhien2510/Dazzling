import React from 'react';
import { motion } from 'motion/react';

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isMe, timestamp }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, x: isMe ? 20 : -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
    >
      <div 
        className={`px-4 py-2 rounded-4 shadow-sm ${isMe ? 'bg-primary-lavender text-white rounded-br-none' : 'bg-white text-dark rounded-bl-none shadow-sm'}`}
        style={{ maxWidth: '80%' }}
      >
        <span className="small fw-medium">{text}</span>
      </div>
      <span className="small text-secondary-muted mt-1" style={{ fontSize: '10px' }}>{timestamp}</span>
    </motion.div>
  );
};

export default MessageBubble;
