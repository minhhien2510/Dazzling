import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { MockApiService } from '../services/api';

const Moments: React.FC = () => {
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockApiService.getMoments().then(data => {
      setMoments(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-5">Loading Feed...</div>;

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <div className="mb-5 text-center">
         <h1 className="fw-bold dazzle-text-gradient mb-2">Studio Feed</h1>
         <p className="text-secondary-muted">What's happening in the Dazzling community.</p>
      </div>

      <div className="d-flex flex-column gap-5">
        {moments.map((moment, idx) => (
          <motion.div 
            key={moment.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="glass-card overflow-hidden bg-white bg-opacity-80 border-0 shadow-sm">
               {/* Header */}
               <div className="p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                     <img src={moment.avatar} width="42" height="42" className="rounded-circle border-2 border-primary-lavender bg-white" alt="avatar" />
                     <div>
                        <h6 className="mb-0 fw-bold text-dark">{moment.username}</h6>
                        <span className="text-secondary-muted small opacity-75">{moment.timestamp}</span>
                     </div>
                  </div>
                  <MoreHorizontal className="text-secondary-muted opacity-50 cursor-pointer" />
               </div>

               {/* Image */}
               <div className="px-3">
                 <img src={moment.imageUrl} className="w-100 rounded-4 shadow-sm" alt="post" />
               </div>

               {/* Actions */}
               <div className="p-4">
                  <div className="d-flex gap-4 mb-3 text-secondary-muted">
                     <div className="d-flex align-items-center gap-2 cursor-pointer group">
                        <Heart size={22} className="group-hover:text-secondary-rose transition-colors" />
                        <span className="small fw-bold">{moment.likes}</span>
                     </div>
                     <div className="d-flex align-items-center gap-2 cursor-pointer group">
                        <MessageCircle size={22} className="group-hover:text-primary-lavender transition-colors" />
                        <span className="small fw-bold">{moment.comments}</span>
                     </div>
                     <Share2 size={22} className="ms-auto hover:text-accent-blue transition-colors cursor-pointer" />
                  </div>
                  <p className="mb-0 text-dark" style={{ fontSize: '0.9rem' }}>
                    <span className="fw-bold me-2 text-primary-lavender">@{moment.username}</span>
                    <span className="opacity-90">{moment.caption}</span>
                  </p>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Moments;
