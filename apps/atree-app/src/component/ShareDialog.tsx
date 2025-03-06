import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from 'react-share';
import { Facebook, Twitter, WhatsApp, LinkedIn } from '@mui/icons-material';

interface ShareDialogProps {
  open: boolean;
  handleClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, handleClose }) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Share this page</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} justifyContent="center">
          <FacebookShareButton url={shareUrl}>
            <IconButton color="primary">
              <Facebook fontSize="large" />
            </IconButton>
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl}>
            <IconButton color="primary">
              <Twitter fontSize="large" />
            </IconButton>
          </TwitterShareButton>

          <WhatsappShareButton url={shareUrl}>
            <IconButton color="primary">
              <WhatsApp fontSize="large" />
            </IconButton>
          </WhatsappShareButton>

          <LinkedinShareButton url={shareUrl}>
            <IconButton color="primary">
              <LinkedIn fontSize="large" />
            </IconButton>
          </LinkedinShareButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
