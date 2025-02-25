//@ts-nocheck
import React, { use, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Checkbox,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { CommonDrawer, CommonSearch, Footer, TopAppBar } from '@shared-lib';

interface LayoutProps {
  children: React.ReactNode;
  isLoadingChildren?: boolean;
  isFooter?: boolean;
  showBack?: boolean;
  backTitle?: string;
  showLogo?: boolean;
  sx?: object;
  categorieItems?: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  }[];
  drawerItems?: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  }[];
  onItemClick?: (to: string) => void;
  backIconClick?: () => void;
  showTopAppBar?: {
    title?: string;
    showMenuIcon?: boolean;
    showBackIcon?: boolean;
    menuIconClick?: () => void;
    onMenuClose?: () => void;
    actionButtonLabel?: string;
    actionButtonClick?: () => void;
    actionButtonColor?: 'inherit' | 'primary' | 'secondary' | 'default';
    position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
    color?: 'primary' | 'secondary' | 'default' | 'transparent' | 'inherit';
    profileIcon?: {
      icon: React.ReactNode;
      ariaLabel: string;
      anchorEl?: HTMLElement | null;
      onLogoutClick?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => void;
      onOptionClick?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => void;
    }[];
    actionIcons?: {
      icon: React.ReactNode;
      ariaLabel: string;
      anchorEl?: HTMLElement | null;
      onLogoutClick?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => void;
      onOptionClick?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => void;
    }[];
  };
  topAppBarIcons?: {
    icon: React.ReactNode;
    ariaLabel: string;
    onClick: () => void;
  }[];
}

export default function Layout({
  children,
  isLoadingChildren = false,
  isFooter = true,
  showBack = false,
  backTitle = '',
  showLogo = false,
  showTopAppBar = {},
  topAppBarIcons = [],
  drawerItems = [],
  categorieItems = [],
  onItemClick,
  backIconClick,
  sx = {},
}): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refs, setRefs] = useState({});
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    const handleResize = debounce(() => {
      const totalHeight = Object.keys(refs).reduce((acc, key) => {
        const ref = refs[key];
        if (ref) {
          return acc + ref.offsetHeight;
        }
        return acc;
      }, 0);
      setLayoutHeight(totalHeight);
    }, 500);

    window.addEventListener('resize', handleResize);

    if (Object.keys(refs).length) {
      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [Object.keys(refs).length]);

  const handleButtonClick = () => {
    console.log('Footer button clicked!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      {showTopAppBar && (
        <Box
          ref={(refAppBar) => {
            if (refs.topAppBar !== refAppBar) {
              setRefs((e) => ({ ...e, topAppBar: refAppBar }));
            }
          }}
          sx={{
            display: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '100%',
              bgcolor: '#FFFFFF',
            }}
            minHeight={'64px'}
          >
            <TopAppBar
              title="Dashboard"
              bgcolor="#FDF7FF"
              profileIcon={showTopAppBar?.profileIcon}
              actionIcons={topAppBarIcons}
              menuIconClick={() => setIsDrawerOpen(true)}
              onLogoutClick={(event) => action.onLogoutClick(event)}
              {...showTopAppBar}
            />
          </Box>
        </Box>
      )}

      <CommonDrawer
        anchor="left"
        open={isDrawerOpen}
        onDrawerClose={() => setIsDrawerOpen(false)}
        items={drawerItems}
        categories={categorieItems}
        onItemClick={(to) => {
          onItemClick?.(to);
          setIsDrawerOpen(false);
        }}
      />

      {showBack && backIconClick && (
        <Box
          ref={(refBack) => {
            if (refs.backButton !== refBack) {
              setRefs((e) => ({ ...e, backButton: refBack }));
            }
          }}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            bgcolor: '#FFFFFF',
            position: 'fixed',
            top: '55px',
            zIndex: 1100,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={backIconClick}
            sx={{
              textTransform: 'none',
              color: '#1E1B16',
              fontSize: '16px',
            }}
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              {backTitle}
            </Typography>
          </Button>
        </Box>
      )}
      <Box>
        {isLoadingChildren && (
          <Box
            sx={{
              width: '100%',
              height: `calc(100vh - ${layoutHeight}px)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {children}
      </Box>

      {isFooter && (
        <Box
          ref={(refFoot) => {
            if (refs.footer !== refFoot) {
              setRefs((e) => ({ ...e, footer: refFoot }));
            }
          }}
          sx={{
            width: '100%',
            bgcolor: 'white',
          }}
        >
          <Footer
            buttonLabel="Continue"
            buttonHeight="40px"
            buttonBorderRadius="50px"
            buttonBackgroundColor="#FDBE16"
            buttonColor="#1E1B16"
            buttonFontSize="14px"
            buttonFontWeight={500}
            buttonSupportingText=""
            bottompx={0}
            onButtonClick={handleButtonClick}
          />
        </Box>
      )}
    </Box>
  );
}
