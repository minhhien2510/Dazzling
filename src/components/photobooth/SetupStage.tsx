import React from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Layout, Clock, Zap, Camera, Upload } from 'lucide-react';

interface SetupStageProps {
  onStart: (config: { layout: string, timer: number }) => void;
}

const SetupStage: React.FC<SetupStageProps> = ({ onStart }) => {
  const [layout, setLayout] = React.useState('1x4');
  const [timer, setTimer] = React.useState(3);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Row className="justify-content-center h-100 align-items-center">
        <Col lg={8}>
          <Card className="glass-card p-5 text-center">
            <h1 className="fw-bold dazzle-text-gradient mb-4 display-4">Ready to Dazzle?</h1>
            <p className="text-secondary-muted mb-5">Customize your session and get ready for the 4-cut aesthetic.</p>

            <Row className="mb-5 text-start">
              <Col md={6}>
                <h5 className="fw-bold mb-3"><Layout size={20} className="me-2 text-primary-lavender" /> Select Layout</h5>
                <div className="d-flex gap-3">
                  <div 
                    onClick={() => setLayout('1x4')}
                    className={`p-3 rounded-4 border-2 text-center cursor-pointer transition-all flex-grow-1 ${layout === '1x4' ? 'border-primary-lavender bg-primary-lavender bg-opacity-10' : 'border-secondary opacity-20'}`}
                  >
                    <div className="mb-2 bg-secondary opacity-50 mx-auto" style={{ width: '20px', height: '60px', borderRadius: '2px' }}></div>
                    <span className={`small fw-bold ${layout === '1x4' ? 'text-primary-lavender' : 'text-secondary opacity-50'}`}>1 x 4 Strip</span>
                  </div>
                  <div 
                    onClick={() => setLayout('2x2')}
                    className={`p-3 rounded-4 border-2 text-center cursor-pointer transition-all flex-grow-1 ${layout === '2x2' ? 'border-primary-lavender bg-primary-lavender bg-opacity-10' : 'border-secondary opacity-20'}`}
                  >
                    <div className="mb-2 bg-secondary opacity-50 mx-auto" style={{ width: '40px', height: '40px', borderRadius: '2px' }}></div>
                    <span className={`small fw-bold ${layout === '2x2' ? 'text-primary-lavender' : 'text-secondary opacity-50'}`}>2 x 2 Grid</span>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                 <h5 className="fw-bold mb-3"><Clock size={20} className="me-2 text-primary-lavender" /> Countdown</h5>
                 <div className="d-flex gap-2">
                    {[3, 5, 10].map(t => (
                      <Button 
                        key={t}
                        className={`btn btn-outline-lavender rounded-pill flex-grow-1 fw-bold ${timer === t ? 'active' : ''}`}
                        onClick={() => setTimer(t)}
                      >
                        {t}s
                      </Button>
                    ))}
                 </div>
                 <div className="mt-4 p-3 glass-card bg-secondary bg-opacity-5 rounded-4 border border-secondary border-opacity-10">
                    <Form.Check 
                        type="switch"
                        id="auto-capture"
                        label="Auto-capture session"
                        defaultChecked
                        className="small fw-bold"
                    />
                 </div>
              </Col>
            </Row>

            <div className="d-grid gap-3">
              <Button 
                onClick={() => onStart({ layout, timer })}
                className="btn-dazzle btn-lg py-3 rounded-pill fw-bold"
              >
                <Camera size={20} className="me-2 d-inline" /> Start Session Now
              </Button>
              <Button variant="link" className="text-secondary text-decoration-none small">
                 <Upload size={16} className="me-2 d-inline" /> Or upload images from gallery
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default SetupStage;
