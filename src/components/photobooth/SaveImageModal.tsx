import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Save } from 'lucide-react';
import { NAME_SUGGESTIONS } from '../../types/photobooth';

interface SaveImageModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (fileName: string) => Promise<void>;
  isSaving: boolean;
}

const SaveImageModal: React.FC<SaveImageModalProps> = ({ show, onHide, onSave, isSaving }) => {
  const [name, setName] = useState('');

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onSave(trimmed);
    setName('');
  };

  const handleSuggestion = (suggestion: string) => {
    setName(suggestion);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Lưu ảnh vào Gallery</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label className="small fw-bold">Tên ảnh</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên cho ảnh của bạn..."
            className="rounded-4 py-2"
            autoFocus
          />
        </Form.Group>

        <p className="small text-secondary-muted mt-3 mb-2">Gợi ý nhanh:</p>
        <div className="d-flex flex-wrap gap-2">
          {NAME_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={() => handleSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="link" className="text-secondary-muted" onClick={onHide}>
          Hủy
        </Button>
        <Button
          className="btn-dazzle rounded-pill px-4"
          onClick={handleSave}
          disabled={!name.trim() || isSaving}
        >
          {isSaving ? (
            <Spinner size="sm" animation="border" className="me-2" />
          ) : (
            <Save size={16} className="me-2" />
          )}
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SaveImageModal;
