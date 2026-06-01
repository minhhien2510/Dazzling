import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Target, Heart, Eye } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Container className="py-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-5 pb-5">
         <h1 className="display-3 fw-bold mb-4">Our <span className="dazzle-text-gradient">Story</span></h1>
         <p className="lead text-secondary-muted mx-auto" style={{ maxWidth: '800px' }}>
            DAZZLING was born out of a simple desire: to make high-quality, 
            fun-filled studio experiences accessible to everyone, anywhere in the world.
         </p>
      </motion.div>

      <Row className="gy-5 mb-5 align-items-center">
         <Col lg={6}>
            <div className="glass-card p-5 border-0 shadow-lg bg-white bg-opacity-80">
               <h2 className="display-5 fw-bold mb-4 text-dark">Our Mission</h2>
               <p className="text-secondary-muted lead mb-5">
                  To revolutionize the way people capture and share their most precious moments 
                  through innovative technology and interactive social play.
               </p>
               <div className="d-flex gap-5">
                  <div className="text-center">
                     <div className="bg-primary-lavender bg-opacity-10 p-3 rounded-circle mb-3 d-inline-block shadow-sm">
                        <Target className="text-primary-lavender" />
                     </div>
                     <p className="small fw-bold text-dark">Innovation</p>
                  </div>
                  <div className="text-center">
                     <div className="bg-secondary-rose bg-opacity-10 p-3 rounded-circle mb-3 d-inline-block shadow-sm">
                        <Heart className="text-secondary-rose" />
                     </div>
                     <p className="small fw-bold text-dark">Connection</p>
                  </div>
                  <div className="text-center">
                     <div className="bg-accent-blue bg-opacity-10 p-3 rounded-circle mb-3 d-inline-block shadow-sm">
                        <Eye className="text-accent-blue" />
                     </div>
                     <p className="small fw-bold text-dark">Vision</p>
                  </div>
               </div>
            </div>
         </Col>
         <Col lg={6}>
            <motion.div
               initial={{ rotate: -2, scale: 0.95 }}
               whileInView={{ rotate: 0, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
               <img 
                 src="https://images.unsplash.com/photo-1522071823914-721ecc85a0c6?auto=format&fit=crop&q=80&w=800" 
                 className="img-fluid rounded-4 shadow-2xl border-4 border-white"
                 alt="team"
               />
            </motion.div>
         </Col>
      </Row>

      <div className="mt-5 pt-5">
         <h2 className="text-center fw-bold mb-5 h1">The <span className="dazzle-text-gradient">Visionaries</span></h2>
         <Row className="gy-4">
            {[
              { name: 'Sarah Chen', role: 'CEO & Founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
              { name: 'Marcus Liu', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
              { name: 'Elena Ross', role: 'Product Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
              { name: 'David Kim', role: 'Marketing Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
            ].map((member, idx) => (
              <Col key={`visionary-${idx}`} md={6} lg={3}>
                 <Card className="glass-card text-center p-4 bg-white bg-opacity-70 border-0 shadow-sm">
                    <img src={member.avatar} width="100" height="100" className="rounded-circle mx-auto mb-3 border-4 border-primary-lavender bg-white p-1" alt={member.name} />
                    <h5 className="fw-bold mb-1 text-dark">{member.name}</h5>
                    <p className="text-secondary-muted small mb-0">{member.role}</p>
                 </Card>
              </Col>
            ))}
         </Row>
      </div>
    </Container>
  );
};

export default About;
