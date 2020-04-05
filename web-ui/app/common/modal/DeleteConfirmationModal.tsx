/**
 * @prettier
 */

import * as React from "react";
import "./DeleteConfirmationModal.scss";
import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmationModalProps {
  message: string;
  modalTitle?: string;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isOpen: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  message,
  modalTitle,
  onConfirmDelete,
  onCancelDelete,
  isOpen
}) => {
  return (
    isOpen && (
      <Modal className="deleteConfirmationModal" show={isOpen} onHide={onCancelDelete} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="deleteConfirmationModal__message">{message}</div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );
};

export default DeleteConfirmationModal;
