import React from 'react';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Camera, Sparkles, Zap, Heart, MessageCircle, Star, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 mb-5 overflow-hidden">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="d-inline-block px-3 py-1 glass-card mb-4 text-primary-lavender fw-bold small">
                  <Sparkles size={16} className="me-2 d-inline" /> NEXT GEN PHOTOBOOTH
                </div>
                <h1 className="display-2 fw-bold mb-4">
                  Capture the <span className="dazzle-text-gradient">Magic</span> <br /> 
                  of Every Moment.
                </h1>
                <p className="lead text-secondary-muted mb-5 pe-lg-5">
                  Join thousands of users in the world's most interactive online photobooth. 
                  Virtual rooms, AI filters, and group sessions with friends!
                </p>
                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                  <Button as={Link as any} to="/photobooth" className="btn-dazzle btn-lg">
                    Start Booth <Zap size={18} className="ms-2 d-inline" />
                  </Button>
                </div>
                
                <div className="mt-5 d-flex align-items-center gap-3 justify-content-center justify-content-lg-start">
                   <div className="d-flex">
                      {[1,2,3,4].map(i => (
                        <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 10}`} width="40" className="rounded-circle border border-white ms-n2" alt="avatar" />
                      ))}
                   </div>
                   <span className="small text-secondary fw-bold">Joined by 10k+ Gen Z creators</span>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="position-relative"
              >
                <div className="floating">
                   <div className="glass-card p-2 shadow-2xl bg-white border-0">
                    <img 
                        src={IMAGES.hero} 
                        alt="App Screenshot" 
                        className="img-fluid rounded-4"
                    />
                   </div>
                  {/* Decorative Elements */}
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="position-absolute top-0 start-0 translate-middle glass-card p-3 shadow-lg bg-primary-pink text-white"
                  >
                    <Heart size={24} fill="currentColor" />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="position-absolute bottom-0 end-0 translate-middle glass-card p-3 shadow-lg bg-primary-blue text-white"
                  >
                    <Star size={24} fill="currentColor" />
                  </motion.div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold h1 d-inline-block border-bottom border-primary-lavender pb-2">Trending <span className="text-secondary-rose">Frames</span></h2>
            <p className="text-secondary-muted mt-3">Explore the community's favorites this week.</p>
          </div>
          <Row className="gy-4">
            {IMAGES.frames.map((src, i) => (
              <Col key={`trending-${i}`} md={6} lg={3}>
                <motion.div 
                  whileHover={{ y: -10 }} 
                  className="glass-card overflow-hidden h-100 group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="position-relative overflow-hidden">
                    <img src={src} className="w-full h-64 object-cover" alt="frame" />
                    <div className="position-absolute top-0 end-0 p-3">
                        <Badge bg="secondary-rose" className="border-0 shadow-sm">NEW</Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-white bg-opacity-80">
                    <h5 className="fw-bold mb-1 text-dark">Aesthetic {['Vibe', 'Retro', 'Minimal', 'Pastel'][i]}</h5>
                    <p className="small text-secondary-muted mb-0">Used by {1200 + i * 450} creators</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Feature Grid - Enhanced */}
      <section className="py-5 my-5">
        <Container>
           <Row className="gy-4">
              <Col lg={6}>
                <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-5 h-100 dazzle-gradient text-white overflow-hidden position-relative">
                   <div className="position-relative z-10">
                      <h2 className="display-5 fw-bold mb-4">Virtual Rooms</h2>
                      <p className="lead mb-4">
                        Invite your squad! Pose together in real-time. 4-cut strips ready in seconds.
                      </p>
                      <Button variant="light" as={Link as any} to="/photobooth" className="rounded-pill px-4 py-2 fw-bold text-primary shadow">Create Room Now</Button>
                   </div>
                   <div className="position-absolute end-0 bottom-0 opacity-20 translate-middle-y">
                      <UsersIcon size={200} />
                   </div>
                </motion.div>
              </Col>
              <Col lg={6}>
                 <Row className="gy-4 h-100">
                    <Col xs={12}>
                        <motion.div whileHover={{ x: 10 }} className="glass-card p-4 h-100 bg-dark bg-opacity-50 text-white d-flex align-items-center gap-4">
                           <div className="bg-primary-pink p-3 rounded-4 shadow-lg flex-shrink-0">
                              <Zap size={30} />
                           </div>
                           <div>
                              <h4 className="fw-bold mb-1">Instant Share</h4>
                              <p className="text-secondary small mb-0">Post your moments and get viral tokens instantly.</p>
                           </div>
                        </motion.div>
                    </Col>
                    <Col xs={12}>
                        <motion.div whileHover={{ x: 10 }} className="glass-card p-4 h-100 bg-dark bg-opacity-50 text-white d-flex align-items-center gap-4">
                           <div className="bg-primary-blue p-3 rounded-4 shadow-lg flex-shrink-0">
                              <MessageCircle size={30} />
                           </div>
                           <div>
                              <h4 className="fw-bold mb-1">Interactive Chat</h4>
                              <p className="text-secondary small mb-0">React, comment, and send strips directly to friends.</p>
                           </div>
                        </motion.div>
                    </Col>
                 </Row>
              </Col>
           </Row>
        </Container>
      </section>


      {/* Testimonials */}
      <section className="py-5 my-5">
         <Container>
            <Row className="justify-content-center text-center mb-5">
               <Col lg={8}>
                  <h2 className="fw-bold h1">Loved by <span className="text-primary-pink">Creators</span></h2>
               </Col>
            </Row>
            <Row className="gy-4">
               {IMAGES.testimonials.map((src, i) => (
                 <Col key={i} md={4}>
                    <Card className="glass-card p-4 border-0 h-100 text-center">
                       <img src={src} width="80" height="40" className="rounded-circle mx-auto mb-3 border-2 border-primary" alt="user" />
                       <div className="text-warning mb-3">
                          {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                       </div>
                       <p className="text-secondary small mb-0">
                         "Dazzling is my go-to for capturing memories with my online friends. 
                         The frames are so aesthetic and the virtual room experience is seamless!"
                       </p>
                       <h6 className="fw-bold mt-3 mb-1">@{['shirley_02', 'jack_pixel', 'aesthetic_luna'][i]}</h6>
                    </Card>
                 </Col>
               ))}
            </Row>
         </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
         <Container>
            <div className="glass-card p-5 dazzle-gradient text-white text-center rounded-5">
               <h2 className="display-4 fw-bold mb-4">Start Dazzling Today</h2>
               <p className="lead mb-5 mx-auto opacity-90" style={{ maxWidth: '600px' }}>
                  The world's first interactive social photobooth is waiting for you. 
                  Capture your first moment now.
               </p>
               <Button as={Link as any} to="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-primary shadow-xl">
                  Sign Up For Free
               </Button>
            </div>
         </Container>
      </section>
    </div>
  );
};

export default Home;
