import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from 'react-share';
import {
  Facebook,
  Twitter,
  WhatsApp,
  LinkedIn,
  ContentCopy,
} from '@mui/icons-material';

interface ShareDialogProps {
  open: boolean;
  handleClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, handleClose }) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 sec
  };
  const commonIconButtonStyles = {
    backgroundColor: '#FFBD0D',
    color: '#000000',
    borderRadius: '100px',
    '&:hover': { backgroundColor: '#1256A2' },
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { borderRadius: '16px', padding: 2 },
      }}
    >
      <DialogTitle>Share this page</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2} alignItems="center">
          {/* Read-only Text Field with Copy Button */}

          {/* Social Media Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <FacebookShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <Facebook
                  fontSize="large"
                  sx={{ fontSize: '40px', borderRadius: '50%' }}
                />
              </IconButton>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <Twitter fontSize="large" />
              </IconButton>
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <WhatsApp fontSize="large" />
              </IconButton>
            </WhatsappShareButton>

            <LinkedinShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <LinkedIn fontSize="large" />
              </IconButton>
            </LinkedinShareButton>
          </Stack>
          <Stack direction="column" spacing={1} width="100%">
            <Typography variant="body1" fontWeight="bold">
              Copy Link:
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
              <TextField
                fullWidth
                value={shareUrl}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
              <Tooltip title={copySuccess ? 'Copied!' : 'Copy link'}>
                <IconButton
                  onClick={handleCopy}
                  color="primary"
                  sx={{ color: '#000000' }}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="secondary"
          sx={{
            color: '#2B3133',
            width: { xs: '80%', sm: '60%', md: '50%' }, // Responsive width
            height: '44px',
            background: '#FFBD0D',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'none',
            alignSelf: 'center', // Centers in flex container
            mx: 'auto',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
