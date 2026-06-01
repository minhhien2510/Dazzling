import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Download, Share2, Sparkles, RefreshCw, Palette } from 'lucide-react';

interface MergeStageProps {
  photos: string[];
  config: { layout: string };
  onComplete: (finalStrip: string) => void;
  onRetake: () => void;
}

const MergeStage: React.FC<MergeStageProps> = ({ photos, config, onComplete, onRetake }) => {
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [finalStrip, setFinalStrip] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frames = [
    { name: 'Studio Cream', color: '#FAF7F2', textColor: '#2B2B2B' },
    { name: 'Soft Lavender', color: '#B8A8D8', textColor: '#ffffff' },
    { name: 'Dusty Rose', color: '#D9A5B3', textColor: '#ffffff' },
    { name: 'Classic Charcoal', color: '#2B2B2B', textColor: '#FAF7F2' },
    { name: 'Sage Garden', color: '#A8C3B0', textColor: '#ffffff' }
  ];

  const mergePhotos = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frame = frames[selectedFrame];
    const imageWidth = 400;
    const imageHeight = 300;
    const padding = 20;
    const margin = 40;

    let canvasWidth, canvasHeight;

    if (config.layout === '1x4') {
      canvasWidth = imageWidth + (padding * 2);
      canvasHeight = (imageHeight * 4) + (padding * 5) + margin;
    } else { // 2x2
      canvasWidth = (imageWidth * 2) + (padding * 3);
      canvasHeight = (imageHeight * 2) + (padding * 3) + margin;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw Background
    ctx.fillStyle = frame.color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Photos
    const promises = photos.map((src, i) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          let x, y;
          if (config.layout === '1x4') {
            x = padding;
            y = padding + (i * (imageHeight + padding));
          } else { // 2x2
            x = padding + (i % 2) * (imageWidth + padding);
            y = padding + Math.floor(i / 2) * (imageHeight + padding);
          }
          ctx.drawImage(img, x, y, imageWidth, imageHeight);
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(promises).then(() => {
        // Add "DAZZLING" Logo Text
        ctx.fillStyle = frame.textColor;
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('DAZZLING MOMENT', canvasWidth / 2, canvasHeight - 20);
        
        // Add Timestamp
        ctx.font = '12px Inter';
        ctx.globalAlpha = 0.6;
        ctx.fillText(new Date().toLocaleDateString(), canvasWidth / 2, canvasHeight - 45);
        ctx.globalAlpha = 1.0;

        setFinalStrip(canvas.toDataURL('image/png'));
    });
  };

  useEffect(() => {
    mergePhotos();
  }, [selectedFrame, config.layout]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-100">
      <Row className="gy-4">
        {/* Preview Area */}
        <Col lg={7} className="text-center d-flex flex-column align-items-center">
            <div className="glass-card p-4 d-inline-block shadow-2xl mb-4 bg-white bg-opacity-40">
                <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', display: finalStrip ? 'block' : 'none' }} />
                {!finalStrip && <div className="p-5 text-primary-lavender fw-bold">Generating Strip...</div>}
            </div>
            
            <div className="d-flex gap-3">
               <Button className="btn btn-outline-lavender rounded-pill px-4" onClick={onRetake}>
                  <RefreshCw size={18} className="me-2 d-inline" /> Retake All
               </Button>
               <Button className="btn-dazzle rounded-pill px-5" onClick={() => finalStrip && onComplete(finalStrip)}>
                  Continue <Sparkles size={18} className="ms-2 d-inline" />
               </Button>
            </div>
        </Col>

        {/* Customization Area */}
        <Col lg={5}>
          <Card className="glass-card p-4 bg-white bg-opacity-60 border-0 shadow-sm">
            <h5 className="fw-bold mb-4 d-flex align-items-center"><Palette size={20} className="me-2 text-primary-lavender" /> Customize Strip</h5>
            
            <div className="mb-4">
                <label className="small text-secondary-muted fw-bold mb-3 d-block uppercase tracking-wider">SELECT FRAME</label>
                <div className="d-flex flex-column gap-2">
                    {frames.map((f, i) => (
                        <div 
                            key={i}
                            onClick={() => setSelectedFrame(i)}
                            className={`p-3 rounded-4 border-2 cursor-pointer transition-all d-flex align-items-center justify-content-between ${selectedFrame === i ? 'border-primary-lavender bg-primary-lavender bg-opacity-10' : 'border-secondary border-opacity-10'}`}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle border shadow-sm" style={{ width: '24px', height: '24px', backgroundColor: f.color }}></div>
                                <span className={`small ${selectedFrame === i ? 'fw-bold text-primary-lavender' : 'text-dark opacity-75'}`}>{f.name}</span>
                            </div>
                            {selectedFrame === i && <Sparkles size={16} className="text-primary-lavender" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 glass-card bg-primary-lavender bg-opacity-5 border-primary-lavender border-opacity-10 rounded-4">
                <h6 className="fw-bold mb-1 text-primary-lavender">AI Suggestion</h6>
                <p className="small text-secondary-muted mb-0">Based on your palette, the "Studio Cream" frame would offer the most premium, high-end studio look. 96% match.</p>
            </div>
            
            <div className="mt-5 d-flex gap-3">
                <Button variant="dark" className="w-100 rounded-pill py-2 small border border-secondary border-opacity-20">Download Assets</Button>
                <Button variant="link" className="w-100 text-secondary text-decoration-none small">Preview Fullscreen</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default MergeStage;
