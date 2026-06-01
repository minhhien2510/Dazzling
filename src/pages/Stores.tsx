import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Search, MapPin, Star, Navigation } from 'lucide-react';
import { MockApiService } from '../services/api';

const Stores: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    MockApiService.getStores().then(setStores);
  }, []);

  const filteredStores = stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container className="py-5">
      <div className="mb-5">
         <h1 className="fw-bold mb-2"><span className="dazzle-text-gradient">Offline</span> Studio</h1>
         <p className="text-secondary-muted">Find a Dazzling physical booth near you.</p>
      </div>

      <Row className="gy-4">
        <Col lg={4}>
           <Card className="glass-card p-4 mb-4 sticky-top bg-white bg-opacity-70 border-0 shadow-sm" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3 text-dark">Find Studio</h5>
              <InputGroup className="mb-4 shadow-sm rounded-4 overflow-hidden border-0">
                 <InputGroup.Text className="bg-white border-0 text-secondary-muted"><Search size={18} /></InputGroup.Text>
                 <Form.Control 
                  placeholder="Search location or store..." 
                  className="bg-white border-0 text-dark py-2" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <h6 className="fw-bold mb-3 text-dark small uppercase tracking-wider">Filter by Style</h6>
              <div className="d-flex flex-wrap gap-2">
                 {['K-Style', 'Vintage', 'Modern', 'Cute', 'Aesthetic'].map(style => (
                   <Button key={style} className="btn-outline-lavender btn-sm rounded-pill px-3 py-1 fw-bold">{style}</Button>
                 ))}
              </div>

              <div className="mt-5 p-4 bg-primary-lavender bg-opacity-10 rounded-4 border border-primary-lavender border-opacity-20 text-center">
                 <h6 className="fw-bold mb-2 text-primary-lavender">Map View Coming Soon!</h6>
                 <p className="small text-secondary-muted mb-0">We are integrating Google Maps for a better experience.</p>
              </div>
           </Card>
        </Col>

        <Col lg={8}>
           <Row className="gy-4">
              {filteredStores.map((store, idx) => (
                <Col key={store.id} md={6}>
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                   >
                     <Card className="glass-card overflow-hidden h-100 border-0 shadow-sm bg-white">
                        <img src={store.image} className="w-100 h-48 object-cover" alt={store.name} />
                        <Card.Body className="p-4">
                           <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                 <h5 className="fw-bold mb-1 text-dark">{store.name}</h5>
                                 <p className="small text-secondary-muted mb-0"><MapPin size={14} className="me-1 d-inline" /> {store.address}</p>
                              </div>
                              <div className="d-flex align-items-center gap-1 text-warning">
                                 <Star size={16} fill="currentColor" /> <span className="small fw-bold">{store.rating}</span>
                              </div>
                           </div>
                           <div className="d-flex justify-content-between align-items-center mt-4">
                              <span className="small text-primary-lavender fw-bold uppercase tracking-wider">{store.style}</span>
                              <Button variant="link" className="text-secondary-muted p-0 d-flex align-items-center gap-1 text-decoration-none hover:text-primary-lavender transition-colors">
                                 <Navigation size={16} /> <span className="small fw-bold">{store.distance}</span>
                              </Button>
                           </div>
                        </Card.Body>
                     </Card>
                   </motion.div>
                </Col>
              ))}
           </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Stores;
