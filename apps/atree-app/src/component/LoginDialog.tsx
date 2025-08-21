import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useAppTranslation } from '../utils/i18n.helper';

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
  title,
  message,
  buttonText,
  onButtonClick,
}) => {
  const { t } = useAppTranslation();

  const defaultTitle = title || t('MESSAGE');
  const defaultMessage = message || t('PLEASE_LOGIN_TO_CONTINUE');
  const defaultButtonText = buttonText || t('PROCEED');
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
      <DialogTitle>{defaultTitle}</DialogTitle>
      <DialogContent>
        <Typography>{defaultMessage}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
        <Button
          variant="contained"
          onClick={onButtonClick || onClose}
          sx={{
            borderRadius: '50px',
            height: '40px',
            width: '100%',
            backgroundColor: '#fcd804',
            color: '#000000',
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          {defaultButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
