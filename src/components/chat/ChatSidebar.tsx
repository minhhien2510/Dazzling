import React from 'react';
import { Card, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
  unreadCount: number;
}

interface ChatSidebarProps {
  friends: Friend[];
  onSelectFriend: (friend: Friend) => void;
  selectedFriendId?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ friends, onSelectFriend, selectedFriendId }) => {
  return (
    <Card className="glass-card h-100 overflow-hidden border-0">
      <div className="p-4 border-bottom border-secondary border-opacity-10">
        <h4 className="fw-bold mb-4">Messages</h4>
        <InputGroup className="bg-dark bg-opacity-50 rounded-pill px-2 border border-secondary border-opacity-20">
          <InputGroup.Text className="bg-transparent border-0 text-secondary">
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control 
            className="bg-transparent border-0 text-white small py-2" 
            placeholder="Search friends..." 
          />
        </InputGroup>
      </div>
      
      <div className="overflow-auto flex-grow-1 chat-list py-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {friends.map(friend => (
          <div 
            key={friend.id}
            onClick={() => onSelectFriend(friend)}
            className={`px-4 py-3 cursor-pointer d-flex align-items-center gap-3 transition-all chat-item ${selectedFriendId === friend.id ? 'bg-primary bg-opacity-10 border-start border-primary border-4' : 'hover:bg-white hover:bg-opacity-5'}`}
            style={{ cursor: 'pointer' }}
          >
            <div className="position-relative">
              <img src={friend.avatar} alt={friend.name} width="50" height="50" className="rounded-circle border" />
              <div 
                className={`position-absolute bottom-0 end-0 border border-white rounded-circle ${friend.status === 'online' ? 'bg-success' : 'bg-secondary'}`} 
                style={{ width: '12px', height: '12px' }}
              ></div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className={`mb-0 fw-bold text-truncate ${selectedFriendId === friend.id ? 'text-primary' : ''}`}>{friend.name}</h6>
                {friend.unreadCount > 0 && (
                  <Badge bg="primary" pill className="small">{friend.unreadCount}</Badge>
                )}
              </div>
              <p className="small text-secondary mb-0 text-truncate">{friend.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChatSidebar;
