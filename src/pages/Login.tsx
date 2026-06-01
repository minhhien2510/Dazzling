import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Github, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MockApiService } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await MockApiService.login(email);
      login(user);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Try alex@example.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-100"
        style={{ maxWidth: '450px' }}
      >
        <Card className="glass-card p-4">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold dazzle-text-gradient h1">Welcome Back</h2>
              <p className="text-secondary-muted small">Ready for your next dazzling session?</p>
            </div>

            {error && <Alert variant="danger" className="py-2 small border-0 bg-opacity-25 bg-danger text-danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-dark">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-dark">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="bg-white bg-opacity-50 border-secondary border-opacity-20 text-dark py-2 rounded-4 focus:bg-white"
                  required
                />
              </Form.Group>
              <Button type="submit" className="btn-dazzle w-100 py-3 mb-3 h5" disabled={loading}>
                {loading ? 'Logging in...' : <><LogIn size={18} className="me-2 d-inline" /> Login</>}
              </Button>
            </Form>

            <div className="text-center mb-4">
              <span className="small text-secondary-muted uppercase tracking-widest" style={{ fontSize: '10px' }}>Or login with</span>
            </div>

            <div className="d-flex gap-2">
              <Button className="btn btn-outline-lavender w-100 d-flex align-items-center justify-content-center gap-2 small py-2 fw-bold">
                <Github size={18} /> GitHub
              </Button>
              <Button className="btn btn-outline-lavender w-100 d-flex align-items-center justify-content-center gap-2 small py-2 fw-bold">
                <Mail size={18} /> Google
              </Button>
            </div>

            <div className="text-center mt-4 pt-2">
              <span className="small text-secondary-muted">Don't have an account? </span>
              <Link to="/register" className="small text-primary-lavender text-decoration-none fw-bold">Register</Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Login;
