import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Pagination,
  Alert,
} from 'react-bootstrap';
import { motion } from 'motion/react';
import { Image, Trash2, Calendar, HardDrive, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { galleryService } from '../services/galleryService';
import type { GalleryItem } from '../types/gallery';
import { formatDate, formatFileSize } from '../utils/format';
import { getApiErrorMessage } from '../services/apiClient';

const PAGE_SIZE = 20;

const GalleryThumbnail: React.FC<{ fileName: string }> = ({ fileName }) => (
  <div className="ratio ratio-1x1 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center">
    <div className="text-center p-3">
      <ImageIcon size={36} className="text-secondary-muted mb-2" />
      <p className="small text-secondary-muted mb-0 text-truncate px-2">{fileName}</p>
    </div>
  </div>
);

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchGallery = useCallback(async (targetPage = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryService.getPage(targetPage, PAGE_SIZE);
      setItems(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery(0);
  }, [fetchGallery]);

  const closePreview = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(false);
  };

  const handleItemClick = async (item: GalleryItem) => {
    setSelectedImage(item);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(true);

    try {
      const { url } = await galleryService.getPresignedUrl(item.id);
      setPreviewUrl(url);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setPreviewError(message);
      toast.error(message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    setDeleting(true);
    try {
      await galleryService.delete(selectedImage.id);
      toast.success('Đã xóa ảnh thành công');
      setShowDeleteConfirm(false);
      closePreview();
      await fetchGallery(page);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchGallery(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold dazzle-text-gradient mb-1">Gallery</h1>
          <p className="text-secondary-muted small mb-0">
            {totalElements} ảnh đã lưu
          </p>
        </div>
        <Button className="btn btn-outline-lavender rounded-pill" onClick={() => fetchGallery(page)}>
          Làm mới
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : items.length === 0 ? (
        <Card className="glass-card text-center p-5">
          <Image size={48} className="text-secondary-muted mb-3 mx-auto" />
          <h5 className="fw-bold">No images found</h5>
          <p className="text-secondary-muted small">
            Hãy chụp ảnh tại Photobooth và nhấn &quot;Lưu ảnh&quot; để thêm vào Gallery.
          </p>
        </Card>
      ) : (
        <>
          <Row className="gy-4">
            {items.map((item) => (
              <Col key={item.id} sm={6} md={4} lg={3}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card
                    className="glass-card overflow-hidden border-0"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleItemClick(item)}
                  >
                    <GalleryThumbnail fileName={item.fileName} />
                    <Card.Body className="p-3">
                      <p className="small fw-bold text-truncate mb-1">{item.fileName}</p>
                      <p className="small text-secondary-muted mb-0">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="small text-secondary-muted mb-0">
                        {formatFileSize(item.fileSize)}
                      </p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-5">
              <Pagination.Prev
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i}
                  active={i === page}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
              />
            </Pagination>
          )}
        </>
      )}

      <Modal show={!!selectedImage} onHide={closePreview} size="lg" centered>
        {selectedImage && (
          <>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold">{selectedImage.fileName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {previewLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="small text-secondary-muted mt-3 mb-0">Đang tải ảnh...</p>
                </div>
              ) : previewError ? (
                <Alert variant="danger" className="mb-0">
                  {previewError}
                </Alert>
              ) : previewUrl ? (
                <Row className="gy-4">
                  <Col md={8}>
                    <img
                      src={previewUrl}
                      alt={selectedImage.fileName}
                      className="img-fluid rounded-4 w-100"
                    />
                  </Col>
                  <Col md={4}>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center gap-2 small">
                        <HardDrive size={16} className="text-primary-lavender" />
                        <span>{formatFileSize(selectedImage.fileSize)}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 small">
                        <Calendar size={16} className="text-primary-lavender" />
                        <span>{formatDate(selectedImage.createdAt)}</span>
                      </div>
                      <Button
                        variant="outline-danger"
                        className="rounded-pill mt-2"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 size={16} className="me-2" />
                        Xóa ảnh
                      </Button>
                    </div>
                  </Col>
                </Row>
              ) : null}
            </Modal.Body>
          </>
        )}
      </Modal>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary-muted">
          Bạn có chắc muốn xóa ảnh này? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="link" className="text-secondary-muted" onClick={() => setShowDeleteConfirm(false)}>
            Hủy
          </Button>
          <Button variant="danger" className="rounded-pill px-4" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" animation="border" /> : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Gallery;
