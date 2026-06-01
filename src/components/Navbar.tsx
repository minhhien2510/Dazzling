import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { Camera, Gamepad2, Store, Users, LogIn, User, Sun, Moon, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar expand="lg" fixed="top" className="py-3 shadow-none">
      <Container>
        <Navbar.Brand as={Link as any} to="/" className="fw-bold fs-3 tracking-tighter">
          <span className="dazzle-text-gradient">DAZZLING</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink as any} to="/photobooth" className="px-3 small uppercase tracking-wide">
              Photobooth
            </Nav.Link>
            <Nav.Link as={NavLink as any} to="/games" className="px-3 small uppercase tracking-wide">
              Games
            </Nav.Link>
            <Nav.Link as={NavLink as any} to="/moments" className="px-3 small uppercase tracking-wide">
              Moments
            </Nav.Link>
            <Nav.Link as={NavLink as any} to="/stores" className="px-3 small uppercase tracking-wide">
              Stores
            </Nav.Link>
            <Nav.Link as={NavLink as any} to="/chat" className="px-3 small uppercase tracking-wide position-relative">
              Messages
              {isAuthenticated && (
                <Badge 
                  bg="secondary-rose" 
                  pill 
                  className="position-absolute top-2 end-0 translate-middle border-0" 
                  style={{ fontSize: '0.6rem', padding: '0.3em 0.5em' }}
                >
                  2
                </Badge>
              )}
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-4">
            <Button 
              variant="link" 
              className="p-0 text-dark opacity-75 hover:opacity-100 transition-opacity" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <Nav.Link as={Link as any} to="/dashboard" className="p-0">
                  <img 
                    src={user?.avatar} 
                    alt="avatar" 
                    width="38" 
                    height="38" 
                    className="rounded-circle border-2 border-primary-lavender bg-white" 
                  />
                </Nav.Link>
                <Button variant="link" size="sm" onClick={logout} className="text-secondary-muted text-decoration-none small fw-bold">Logout</Button>
              </div>
            ) : (
              <Button as={Link as any} to="/login" className="btn-dazzle px-4 py-2">
                <LogIn size={18} className="me-2" /> Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
