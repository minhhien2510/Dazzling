import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-100"
        style={{ maxWidth: '450px' }}
      >
        <Card className="glass-card p-4 bg-white bg-opacity-70 border-0 shadow-sm">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold dazzle-text-gradient h1">Create Account</h2>
              <p className="text-secondary-muted small">Join the Dazzling community today!</p>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-dark">Full Name</Form.Label>
                <Form.Control type="text" placeholder="Your Name" className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-dark">Email Address</Form.Label>
                <Form.Control type="email" placeholder="email@example.com" className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-dark">Password</Form.Label>
                <Form.Control type="password" placeholder="••••••••" className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white" />
              </Form.Group>
              <Button className="btn-dazzle w-100 py-3 mb-3 h5">
                <UserPlus size={18} className="me-2 d-inline" /> Register Now
              </Button>
            </Form>

            <div className="text-center mt-4 pt-2">
              <span className="small text-secondary-muted">Already have an account? </span>
              <Link to="/login" className="small text-primary-lavender text-decoration-none fw-bold">Login</Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Register;
