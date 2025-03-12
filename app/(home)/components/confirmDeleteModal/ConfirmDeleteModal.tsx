import * as React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./confirmDeleteModal.css";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  message,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="confirm-modal-title">
      <Box id="confirm-modal-box">
        <Typography id="confirm-modal-message">{message}</Typography>
        <Box id="confirm-modal-buttons">
          <Button onClick={onClose} variant="contained">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
