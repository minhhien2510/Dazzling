import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Send, Image, Smile, Video, Phone, MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface ChatWindowProps {
  friend: Friend;
  messages: Message[];
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ friend, messages, currentUserId }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="glass-card h-100 border-0 flex-grow-1 d-flex flex-column bg-white bg-opacity-60 shadow-none">
      {/* Header */}
      <div className="p-3 border-bottom border-secondary border-opacity-10 d-flex align-items-center justify-content-between bg-white bg-opacity-40">
        <div className="d-flex align-items-center gap-3">
          <img src={friend.avatar} alt={friend.name} width="45" height="45" className="rounded-circle border-2 border-primary-lavender bg-white" />
          <div>
            <h6 className="mb-0 fw-bold text-dark">{friend.name}</h6>
            <span className={`small fw-bold ${friend.status === 'online' ? 'text-accent-sage' : 'text-secondary-muted opacity-50'}`}>
              {friend.status === 'online' ? '● Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="d-flex gap-1">
          <Button variant="link" className="text-secondary-muted p-2 hover:text-primary-lavender transition-colors"><Phone size={18} /></Button>
          <Button variant="link" className="text-secondary-muted p-2 hover:text-primary-lavender transition-colors"><Video size={18} /></Button>
          <Button variant="link" className="text-secondary-muted p-2 hover:text-primary-lavender transition-colors"><MoreVertical size={18} /></Button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-background-cream bg-opacity-30">
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id}
            text={msg.text}
            isMe={msg.senderId === currentUserId}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Composer */}
      <div className="p-3 bg-white bg-opacity-60">
        <Form onSubmit={(e) => { e.preventDefault(); setInputText(''); }}>
          <InputGroup className="bg-white rounded-pill px-3 py-1 border border-secondary border-opacity-10 shadow-sm transition-all focus-within:shadow-md">
            <Button variant="link" className="text-secondary-muted p-1 hover:text-primary-lavender"><Smile size={20} /></Button>
            <Button variant="link" className="text-secondary-muted p-1 hover:text-primary-lavender"><Image size={20} /></Button>
            <Form.Control 
              className="bg-transparent border-0 text-dark small" 
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button type="submit" variant="link" className="text-primary-lavender p-1">
              <Send size={20} fill="currentColor" />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Card>
  );
};

export default ChatWindow;
