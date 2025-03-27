import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const LoginDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  title = 'Message',
  message = 'Please login to continue',
  buttonText = 'Proceed',
  onButtonClick,
}) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose();
      }}
      disableEscapeKeyDown
      PaperProps={{
        style: {
          maxWidth: '600px',
          maxHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onButtonClick || onClose}
          sx={{ borderRadius: '50px', height: '40px', width: '100%' }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
