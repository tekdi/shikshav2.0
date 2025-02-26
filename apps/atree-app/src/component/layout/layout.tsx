import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, debounce, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { CommonDrawer, Footer } from '@shared-lib';
import React, { useEffect, useState } from 'react';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import TopAppBar from './TopToolBar';

interface LayoutProps {
  children: React.ReactNode;
  isLoadingChildren?: boolean;
  isFooter?: boolean;
  showBack?: boolean;
  backTitle?: string;
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
  onItemClick?: (to: string) => void | undefined;
  onBackIconClick?: () => void;
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
  backIconClick?: () => void;
}

export default function Layout({
  children,
  isLoadingChildren = false,
  isFooter = true,
  showBack = false,
  backTitle = '',
  showTopAppBar = {},
  topAppBarIcons = [],
  drawerItems = [],
  categorieItems = [],
  onItemClick,
  backIconClick,
  sx = {},
}): LayoutProps {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refs, setRefs] = useState({});
  const [layoutHeight, setLayoutHeight] = useState();

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
            if (refs?.topAppBar !== refAppBar) {
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
              logoUrl={atreeLogo}
              _appBar={{
                py: '8.5px',
                backgroundColor: '#fff',
              }}
              title="Jal-Jungle-Jameen"
              _title={{
                fontSize: '14px',
                lineHeight: '16px',
                color: 'text.secondary',
                fontWeight: 400,
              }}
              subTitle="In Classrooms"
              _subTitle={{
                fontSize: '14px',
                lineHeight: '16px',
                color: 'text.primary',
                fontWeight: 700,
              }}
              actionButtonColor="secondary"
              // profileIcon={[
              //   {
              //     icon: <>hi</>,
              //     ariaLabel: 'Help',
              //   },
              // ]}
              actionIcons={topAppBarIcons}
              menuIconClick={() => setIsDrawerOpen(true)}
              onLogoutClick={(event) => action.onLogoutClick(event)}
              {...showTopAppBar}
            />
          </Box>
        </Box>
      )}

      <CommonDrawer
        anchor="right"
        open={isDrawerOpen}
        onDrawerClose={() => setIsDrawerOpen(false)}
        items={drawerItems}
        categories={categorieItems}
        onItemClick={(to) => {
          onItemClick?.(to || '');
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
              height: `calc(100vh - ${layoutHeight || 100}px)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 9999,
              backgroundColor: 'white',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Box
          style={{
            width: '100%',
            overflowY: 'auto',
            display: isLoadingChildren ? 'none' : 'block',
            height: `calc(100vh - ${layoutHeight || 100}px)`,
          }}
        >
          {children}
        </Box>
      </Box>

      {isFooter && (
        <Box
          ref={(refFoot) => {
            if (refs?.footer !== refFoot) {
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
