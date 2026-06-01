import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-5 mt-5" style={{ background: 'var(--background-cream)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <h3 className="fw-bold mb-4 dazzle-text-gradient">DAZZLING</h3>
            <p className="text-secondary-muted small pe-lg-5">
              The revolutionary online photobooth experience for the new generation. 
              Capturing moments, creating memories, anywhere, anytime.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-secondary-muted hover:text-primary-lavender transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-secondary-muted hover:text-primary-lavender transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-secondary-muted hover:text-primary-lavender transition-colors"><Youtube size={20} /></a>
              <a href="#" className="text-secondary-muted hover:text-primary-lavender transition-colors"><Facebook size={20} /></a>
            </div>
          </Col>
          <Col lg={2} md={4}>
            <h6 className="fw-bold mb-3 text-dark small uppercase tracking-wider">Platform</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/photobooth" className="text-decoration-none text-secondary-muted small">Virtual Booth</Link></li>
              <li className="mb-2"><Link to="/moments" className="text-decoration-none text-secondary-muted small">Moments Feed</Link></li>
              <li className="mb-2"><Link to="/stores" className="text-decoration-none text-secondary-muted small">Store Finder</Link></li>
            </ul>
          </Col>
          <Col lg={2} md={4}>
            <h6 className="fw-bold mb-3 text-dark small uppercase tracking-wider">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-decoration-none text-secondary-muted small">About Us</Link></li>
              <li className="mb-2"><Link to="#" className="text-decoration-none text-secondary-muted small">Team</Link></li>
              <li className="mb-2"><Link to="#" className="text-decoration-none text-secondary-muted small">Vision</Link></li>
              <li className="mb-2"><Link to="#" className="text-decoration-none text-secondary-muted small">Careers</Link></li>
            </ul>
          </Col>
          <Col lg={4} md={4}>
            <h6 className="fw-bold mb-3 text-dark small uppercase tracking-wider">Join UI/UX News</h6>
            <p className="small text-secondary-muted mb-3">Get the latest frames and challenges.</p>
            <div className="d-flex gap-2">
              <input type="email" className="form-control form-control-sm bg-white border-secondary border-opacity-10 text-dark" placeholder="Email address" />
              <button className="btn btn-sm btn-dazzle px-3">Join</button>
            </div>
          </Col>
        </Row>
        <hr className="my-5 border-secondary border-opacity-10" />
        <div className="text-center text-secondary-muted small opacity-50">
          © 2026 DAZZLING Inc. All rights reserved. Premium Studio Aesthetic.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
