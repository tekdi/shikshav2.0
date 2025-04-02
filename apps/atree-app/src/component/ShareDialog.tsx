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
  SvgIcon,
} from '@mui/material';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from 'react-share';
import {  WhatsApp, ContentCopy } from '@mui/icons-material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
interface ShareDialogProps {
  open: boolean;
  handleClose: () => void;
}
const XIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M17.5 3H20.5L13.8 10.2L21.5 21H15.8L10.9 14.4L5.3 21H2.3L9.4 13.3L2 3H7.9L12.3 9.1L17.5 3ZM16.5 19H18.2L7.3 4H5.5L16.5 19Z"
      fill="currentColor"
    />
  </SvgIcon>
);
const LinkedInCustomIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M4.98 3.5C4.98 4.6 4.09 5.5 3 5.5C1.91 5.5 1.02 4.6 1.02 3.5C1.02 2.4 1.91 1.5 3 1.5C4.09 1.5 4.98 2.4 4.98 3.5ZM5 21H1V7H5V21ZM14.56 7C12.72 7 11.76 8.01 11.33 8.67V7H7V21H11V14.49C11 12.6 11.83 11.53 13.5 11.53C15.14 11.53 15.5 12.93 15.5 14.58V21H19.5V13.96C19.5 9.93 17.27 7 14.56 7Z"
      fill="currentColor"
    />
  </SvgIcon>
);
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
                <FacebookRoundedIcon
                  fontSize="large"
                  sx={{ fontSize: '40px', borderRadius: '50%' }}
                />
              </IconButton>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <XIcon fontSize="large" />
              </IconButton>
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <WhatsApp fontSize="large" />
              </IconButton>
            </WhatsappShareButton>

            <LinkedinShareButton url={shareUrl}>
              <IconButton color="primary" sx={commonIconButtonStyles}>
                <LinkedInCustomIcon
                  fontSize="large"
                  sx={{ background: 'none', borderRadius: 0 }}
                />
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
                // variant="outlined"
                sx={{
                  width: 243,
                  height: 32,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    border: '1px solid #C2C7CF',
                    height: '32px',
                    padding: '0 8px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none', // Removes the default outline
                  },
                }}
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
