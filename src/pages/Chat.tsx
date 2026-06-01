import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { MockApiService } from '../services/api';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import LoadingSpinner from '../components/LoadingSpinner';
import { Navigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    MockApiService.getFriends().then(data => {
      setFriends(data);
      if (data.length > 0) setSelectedFriend(data[0]);
      setLoading(false);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedFriend) {
      MockApiService.getMessages(selectedFriend.id).then(setMessages);
    }
  }, [selectedFriend]);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid className="py-4 h-100" style={{ maxWidth: '1400px' }}>
      <Row className="h-100 gy-4">
        <Col lg={4} md={5}>
          <ChatSidebar 
            friends={friends} 
            selectedFriendId={selectedFriend?.id}
            onSelectFriend={setSelectedFriend}
          />
        </Col>
        <Col lg={8} md={7}>
          {selectedFriend ? (
            <ChatWindow 
              friend={selectedFriend} 
              messages={messages} 
              currentUserId={user?.id || '1'} 
            />
          ) : (
            <div className="h-100 glass-card d-flex align-items-center justify-content-center text-secondary">
               Select a friend to start chatting
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
