import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
interface CommonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  disableCloseOnBackdropClick?: boolean;
}

export const CommonDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  onClose,
  header,
  content,
  actions,
  disableCloseOnBackdropClick = false,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={disableCloseOnBackdropClick ? undefined : onClose}
      aria-labelledby="common-dialog-title"
      aria-describedby="common-dialog-description"
    >
      {header && (
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {' '}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ fontSize: '22px' }}>{header}</Typography>
            <IconButton aria-label="close" onClick={onClose} sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      {content && (
        <DialogContent sx={{ height: '500px' }}>{content}</DialogContent>
      )}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
