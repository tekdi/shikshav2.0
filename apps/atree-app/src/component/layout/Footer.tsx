import { useRouter } from 'next/router';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useEffect, useState } from 'react';
import ShareDialog from '../ShareDialog';
import { useAppTranslation } from '../../utils/i18n.helper';
import GlobalAlert from '../GlobalAlert';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Footer() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  const [openBookmarkDialog, setOpenBookmarkDialog] = useState(false);
  const isTinyPhone = useMediaQuery('(max-width: 390px)');

  const items = [
    { label: t('HOME'), icon: <HomeIcon /> },
    { label: t('BOOKMARK'), icon: <BookmarksIcon /> },
    { label: 'Share', icon: <ShareIcon /> },
  ];
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push('/home');
        break;
      case 1:
        // Handle bookmark - check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          // User is logged in, navigate to bookmark page
          router.push('/home?bookmark=true');
        } else {
          // User is not logged in, show dialog
          setOpenBookmarkDialog(true);
        }
        break;
      case 2:
        setOpen(true);
        break;
    }
  };

  useEffect(() => {
    if (router.asPath.startsWith('/quick-access')) {
      setValue(2);
    } else if (router.asPath.includes('bookmark=true')) {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [router.asPath]);

  // Check for pending alerts on component mount
  useEffect(() => {
    const pendingAlert = localStorage.getItem('pendingAlert');
    if (pendingAlert) {
      try {
        const alertData = JSON.parse(pendingAlert);
        setAlert(alertData);
        localStorage.removeItem('pendingAlert');
      } catch (error) {
        console.error('Error parsing pending alert:', error);
        localStorage.removeItem('pendingAlert');
      }
    }
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure footer stays above other content
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          height: isTinyPhone ? '56px' : '64px',
          bgcolor: 'secondary.main',
          '& .MuiBottomNavigationAction-label': {
            fontSize: isTinyPhone ? '0.65rem' : '0.75rem',
            opacity: 1, // Ensure label is always visible (showLabels prop does this too)
          },
          '& .Mui-selected .MuiBottomNavigationAction-label': {
            fontSize: isTinyPhone ? '0.75rem' : '0.875rem', // Slightly larger when selected
            fontWeight: 'bold', // Optional: make selected label bolder
          },
        }}
      >
        {items.map(({ label, icon }, index) => (
          <BottomNavigationAction
            key={index}
            label={label}
            icon={icon}
            sx={{
              '&.Mui-selected': {
                color: '#1C1B1F',
              },
              color: 'white',
            }}
          />
        ))}
      </BottomNavigation>
      <ShareDialog open={open} handleClose={() => setOpen(false)} />

      {/* Bookmark Login Required Dialog */}
      <Dialog
        open={openBookmarkDialog}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          setOpenBookmarkDialog(false);
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
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ fontSize: '22px' }}>{t('MESSAGE')}</Typography>
            <IconButton
              aria-label="close"
              onClick={() => setOpenBookmarkDialog(false)}
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontFamily: 'Poppins', fontSize: '16px', fontWeight: '500' }}
          >
            {t('LOGIN_REQUIRED_FOR_BOOKMARK')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setOpenBookmarkDialog(false);
              router.push('/signin');
            }}
            sx={{
              borderRadius: '50px',
              height: '40px',
              width: '30%',
              backgroundColor: '#fcd804',
              color: '#000000',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: '500',
              textTransform: 'none',
            }}
          >
            {t('PROCEED')}
          </Button>
        </DialogActions>
      </Dialog>

      <GlobalAlert
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ message: '', severity: 'info' })}
        autoHide={true}
        autoHideDuration={3000}
      />
    </Box>
  );
}
