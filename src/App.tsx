import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Photobooth from './pages/Photobooth';
import Moments from './pages/Moments';
import Stores from './pages/Stores';
import About from './pages/About';
import Chat from './pages/Chat';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navigation />
            <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/photobooth" element={<Photobooth />} />
                <Route path="/moments" element={<Moments />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/about" element={<About />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
