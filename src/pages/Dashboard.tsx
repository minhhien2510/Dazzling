import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Image, Heart, Settings, Grid, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('memories');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container className="py-5">
      <Row className="gy-4">
        {/* Profile Info */}
        <Col lg={4}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="glass-card text-center p-4 bg-white bg-opacity-70 border-0 shadow-sm">
              <div className="mb-4">
                <img 
                  src={user?.avatar} 
                  alt="Avatar" 
                  className="rounded-circle border-4 border-primary-lavender bg-white p-1 mb-3 shadow-md" 
                  width="120" 
                  height="120" 
                />
                <h3 className="fw-bold mb-0 text-dark">{user?.name}</h3>
                <p className="text-secondary-muted small">@{user?.username}</p>
              </div>
              <div className="d-flex justify-content-around mb-4">
                <div>
                   <h5 className="fw-bold mb-0 text-primary-lavender">12</h5>
                   <p className="small text-secondary-muted mb-0">Photos</p>
                </div>
                <div>
                   <h5 className="fw-bold mb-0 text-primary-lavender">45</h5>
                   <p className="small text-secondary-muted mb-0">Friends</p>
                </div>
                <div>
                   <h5 className="fw-bold mb-0 text-primary-lavender">3</h5>
                   <p className="small text-secondary-muted mb-0">Rooms</p>
                </div>
              </div>
              <Button className="btn btn-outline-lavender w-100 rounded-pill py-2 fw-bold">
                <Settings size={16} className="me-2 d-inline" /> Edit Profile
              </Button>
            </Card>
          </motion.div>
        </Col>

        {/* Dynamic Content */}
        <Col lg={8}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Nav variant="pills" className="bg-white bg-opacity-60 rounded-pill p-1 mb-5 shadow-sm border border-secondary border-opacity-10" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'memories')}>
              <Nav.Item className="flex-grow-1 text-center">
                <Nav.Link eventKey="memories" className="rounded-pill py-2 small fw-bold"><Image size={18} className="me-2" /> Memories</Nav.Link>
              </Nav.Item>
              <Nav.Item className="flex-grow-1 text-center">
                <Nav.Link eventKey="favorites" className="rounded-pill py-2 small fw-bold"><Heart size={18} className="me-2" /> Favorites</Nav.Link>
              </Nav.Item>
              <Nav.Item className="flex-grow-1 text-center">
                <Nav.Link eventKey="history" className="rounded-pill py-2 small fw-bold"><History size={18} className="me-2" /> History</Nav.Link>
              </Nav.Item>
            </Nav>

            <Row className="gy-4">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <Col key={`memory-photo-${i}`} sm={6} md={4}>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="glass-card overflow-hidden ratio ratio-1x1"
                    >
                      <img 
                        src={`https://images.unsplash.com/photo-${1511111111111 + i * 100000}?auto=format&fit=crop&q=80&w=300`} 
                        alt="memory" 
                        className="object-cover"
                      />
                    </motion.div>
                 </Col>
               ))}
            </Row>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
