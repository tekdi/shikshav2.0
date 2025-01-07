import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface CommonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode; // Custom header component
  content?: React.ReactNode; // Custom content
  actions?: React.ReactNode; // Custom actions
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
      {header && <DialogTitle id="common-dialog-title">{header}</DialogTitle>}
      {content && <DialogContent>{content}</DialogContent>}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

/* ================ use of commonDialog =================*/

// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
// import { CommonDialog } from './CommonDialog';

// export const ExampleUsage = () => {
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const handleOpenDialog = () => setDialogOpen(true);
//   const handleCloseDialog = () => setDialogOpen(false);

//   const customHeader = <span>Custom Dialog Title</span>;
//   const customContent = (
//     <p>
//       This is a custom dialog content where you can use any JSX elements.
//     </p>
//   );
//   const customActions = (
//     <>
//       <Button onClick={handleCloseDialog}>Cancel</Button>
//       <Button onClick={() => console.log('Confirmed')} autoFocus>
//         Confirm
//       </Button>
//     </>
//   );

//   return (
//     <>
//       <Button variant="outlined" onClick={handleOpenDialog}>
//         Open Custom Dialog
//       </Button>
//       <CommonDialog
//         isOpen={dialogOpen}
//         onClose={handleCloseDialog}
//         header={customHeader}
//         content={customContent}
//         actions={customActions}
//       />
//     </>
//   );
// };
