import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Download, Share2, Instagram, Heart, Home, RefreshCw } from 'lucide-react';

interface ExportStageProps {
  finalStrip: string;
  onRestart: () => void;
  onGoHome: () => void;
}

const ExportStage: React.FC<ExportStageProps> = ({ finalStrip, onRestart, onGoHome }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `dazzling-moment-${Date.now()}.png`;
    link.href = finalStrip;
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="glass-card p-5">
            <Row className="gy-5 align-items-center">
              <Col md={6} className="text-center">
                 <div className="glass-card p-3 d-inline-block shadow-2xl bg-white">
                    <img src={finalStrip} alt="final product" className="img-fluid rounded" style={{ maxHeight: '600px' }} />
                 </div>
              </Col>
              <Col md={6}>
                 <div className="ps-md-4">
                    <h1 className="fw-bold display-4 mb-2 dazzle-text-gradient">Iconic.</h1>
                    <p className="lead text-secondary-muted mb-5">Your masterpiece is ready! Share it with the world or save it to your dazzle-vault.</p>
                    
                    <div className="d-grid gap-3 mb-5">
                       <Button className="btn-dazzle btn-lg py-3 rounded-pill fw-bold" onClick={downloadImage}>
                          <Download size={20} className="me-2 d-inline" /> Download High-Res
                       </Button>
                       <div className="d-flex gap-2">
                          <Button className="btn btn-outline-lavender flex-grow-1 rounded-pill py-3 fw-bold">
                             <Instagram size={18} className="me-2 d-inline" /> Story
                          </Button>
                          <Button className="btn btn-outline-lavender flex-grow-1 rounded-pill py-3 fw-bold">
                             <Share2 size={18} className="me-2 d-inline" /> Share
                          </Button>
                       </div>
                    </div>

                    <div className="p-4 glass-card bg-primary-lavender bg-opacity-5 border-primary-lavender border-opacity-10 rounded-4 mb-5">
                       <div className="d-flex align-items-center gap-2 mb-2 text-primary-lavender fw-bold">
                          <Heart size={18} /> Community Spotlight
                       </div>
                       <p className="small text-secondary-muted mb-0">Share this strip to the Dazzling Feed and get a chance to be featured on our homepage!</p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                       <Button variant="link" className="text-secondary-muted text-decoration-none small" onClick={onGoHome}>
                          <Home size={16} className="me-2 d-inline" /> Back to Home
                       </Button>
                       <Button variant="link" className="text-primary-lavender text-decoration-none small fw-bold" onClick={onRestart}>
                          <RefreshCw size={16} className="me-2 d-inline" /> Start New Session
                       </Button>
                    </div>
                 </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default ExportStage;
