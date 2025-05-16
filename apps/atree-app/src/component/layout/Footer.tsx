import { useRouter } from 'next/router';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useEffect, useState } from 'react';
import ShareDialog from '../ShareDialog';
const items = [
  { label: 'Home', icon: <HomeIcon /> },
  { label: 'Quick Access', icon: <BookmarksIcon /> },
  // { label: 'Bookmarked', icon: <BookmarkBorderIcon /> },
  { label: 'Share', icon: <ShareIcon /> },
];

export default function Footer() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const isTinyPhone = useMediaQuery('(max-width: 390px)');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push('/home');
        break;
      case 1:
        router.push('/quick-access');
        break;
      case 2:
        setOpen(true);
        break;
    }
  };

  useEffect(() => {
    if (router.asPath.startsWith('/quick-access')) {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [router.asPath]);

  return (
    <Box>
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
    </Box>
  );
}
