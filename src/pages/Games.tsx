import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Gamepad2, Trophy, Users, Play } from 'lucide-react';
import { MockApiService } from '../services/api';

const Games: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    MockApiService.getGames().then(setGames);
  }, []);

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
           <h1 className="fw-bold mb-2 h2"><Gamepad2 className="me-3 d-inline text-primary-lavender" /> Social <span className="dazzle-text-gradient">Gaming</span></h1>
           <p className="text-secondary-muted mb-0">Play, compete, and win unique photo frames!</p>
        </div>
        <div className="glass-card px-4 py-2 d-flex align-items-center gap-2 border-0 shadow-sm bg-white">
           <Trophy size={18} className="text-highlight-gold" />
           <span className="small fw-bold text-dark opacity-75">Leaderboard #242</span>
        </div>
      </div>

      <Row className="gy-4">
         {games.map((game, idx) => (
           <Col key={game.id} lg={6}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card p-0 overflow-hidden h-100 flex-row border-0 shadow-sm bg-white">
                  <div className="w-40 d-none d-sm-block">
                    <img src={game.image} className="w-100 h-100 object-cover" alt={game.title} />
                  </div>
                  <Card.Body className="p-4 d-flex flex-column justify-content-between">
                     <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                           <Badge bg="secondary-rose" className="small border-0 shadow-sm">{game.difficulty}</Badge>
                           <span className="small text-secondary-muted d-flex align-items-center gap-1">
                              <Users size={14} /> {game.playersCount} players
                           </span>
                        </div>
                        <h4 className="fw-bold mb-2 text-dark">{game.title}</h4>
                        <p className="text-secondary-muted small mb-4">{game.description}</p>
                     </div>
                     <Button className="btn-dazzle rounded-pill py-2 w-100">
                        <Play size={18} className="me-2 d-inline" /> Play Now
                     </Button>
                  </Card.Body>
                </Card>
              </motion.div>
           </Col>
         ))}

         {/* Viral Challenge of the week */}
         <Col lg={12} className="mt-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-5 text-center border-0 shadow-lg"
              style={{ background: 'var(--primary-gradient)', color: 'white' }}
            >
               <h2 className="display-5 fw-bold mb-3">🔥 Viral Challenge of the Week</h2>
               <h3 className="mb-4 opacity-100">"The Lavender Dream"</h3>
               <p className="mb-4 mx-auto opacity-75" style={{ maxWidth: '600px' }}>
                  Capture a photo using the Soft Lavender frame and post it to the Studio Feed. 
                  Top 10 most liked photos win an exclusive "Golden Memories Edition" frame!
               </p>
               <div className="d-flex justify-content-center gap-3">
                  <Button className="btn btn-light btn-lg px-5 rounded-pill fw-bold" style={{ color: 'var(--primary-lavender)' }}>Join Challenge</Button>
               </div>
            </motion.div>
         </Col>
      </Row>
    </Container>
  );
};

export default Games;
