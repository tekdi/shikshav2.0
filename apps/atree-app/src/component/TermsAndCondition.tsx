import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface CommonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
  disableCloseOnBackdropClick?: boolean;
}

const TermsAndCondition: React.FC<CommonDialogProps> = ({
  isOpen,
  onClose,
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
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {' '}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{
              fontWeight: { xs: 400, md: 500 },
              fontSize: { xs: '24px', md: '64px' },
            }}
          >
            Terms and Conditions
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ height: '500px' }}>
        <Grid container spacing={2}>
          <Typography>
            Welcome to the Jal Jungle Jameen in classrooms digital library
            platform (herein after referred to as “Platform”). Please read the
            following terms and conditions carefully before accessing, using, or
            obtaining any materials, information, or services. The Platform
            includes the website, and mobile application. By accessing any
            component of the Platform you agree to be bound by these terms and
            conditions. We may change, add, or remove portions of these terms
            and conditions at any time, which shall become effective immediately
            upon posting. If these terms are amended in such a way that
            substantially alters the privacy or security, users will be notified
            upon their first return to the platform.
          </Typography>
          <Typography>
            Please contact our team at envedu@atree.org if you have any
            questions, concerns, or comments.
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            1. Open Access and Login Requirements
          </Typography>

          {/* Content */}
          <Typography>
            1.1 General Readers. Access to the environment education resources
            (either sample or full) on the Platform is free but repeat users
            require registration or login. Curated information on the resources
            can be accessed through the website, or mobile application
          </Typography>
          <Typography>
            1.2 Logged-in Readers. Logins are required to personalize the Jal
            Jungle Jameen in classrooms digital library experience through the
            creation of profile(s). Creating profile(s) allows for the following
            to be created, saved, and updated: profile name, reading history,
            bookmarked books, and downloaded books. Logging in also allows for a
            seamless user experience between different devices. To protect your
            privacy, please use a nickname or username when creating a login.
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            2. Termination
          </Typography>
          <Typography>
            ATREE may, in its sole discretion, terminate or suspend access to
            the reader /user community for any reason, including, without
            limitation, breach, or assignment of these terms.
          </Typography>
        </Grid>
      </DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
export default TermsAndCondition;
