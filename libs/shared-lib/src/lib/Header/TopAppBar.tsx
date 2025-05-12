import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import {
  InputBase,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface CommonAppBarProps {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  showSearch?: boolean;
  showMenuIcon?: boolean;
  menuIconClick?: () => void;
}

export const TopAppBar: React.FC<CommonAppBarProps> = ({
  title = 'Jal-Jungle-Jameen',
  subtitle = 'In Classrooms',
  logoUrl = '/logo.png', // Replace with your actual logo path
  showSearch = true,
  showMenuIcon = true,
  menuIconClick,
}) => {
  const theme = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: 'white',
          boxShadow: '0px 2px 2px 0px #00000040',
          // padding: '8px 16px',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: isMobile ? '5px' : undefined,
          }}
        >
          {/* Logo + Title Stack */}
          <Stack alignItems="normal">
            <Image src={logoUrl} alt="logo" width={50} height={50} />
            {!searchOpen && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#E69933',
                    fontStyle: 'italic',
                    textAlign: 'left',
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '14px', color: '#4D4D4D', textAlign: 'left' }}
                >
                  {subtitle}
                </Typography>
              </>
            )}
          </Stack>

          {searchOpen && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <InputBase
                placeholder="Search..."
                sx={{
                  flexGrow: 1,
                  marginLeft: 2,
                  bgcolor: '#fff',
                  padding: 1,
                  borderRadius: 1,
                }}
              />
              <IconButton onClick={() => setSearchOpen(false)}>
                <SearchIcon />
              </IconButton>
            </Box>
          )}
          {/* Left Icons (Search + Menu) */}
          <Box>
            {showSearch && (
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <SearchIcon sx={{ color: 'black' }} />
              </IconButton>
            )}
            {showMenuIcon && (
              <IconButton size="large" color="inherit" onClick={menuIconClick}>
                <MenuIcon sx={{ color: 'black' }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
