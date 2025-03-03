import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, debounce, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { CommonDrawer, Footer, Loader } from '@shared-lib';
import React, { useEffect, useRef, useState } from 'react';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import TopAppBar from './TopToolBar';

interface LayoutProps {
  children?: React.ReactNode;
  footerComponent?: React.ReactNode | string;
  isLoadingChildren?: boolean;
  isFooter?: boolean;
  showBack?: boolean;
  backTitle?: React.ReactNode | string;
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
  _footer?: object;
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
  footerComponent,
  _footer,
}: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const refs = useRef({});

  useEffect(() => {
    const handleResize = debounce(() => {
      const totalHeight = Object.keys(refs.current).reduce((acc, key) => {
        const ref: HTMLElement | undefined =
          refs.current[key as keyof typeof refs.current];
        if (ref) {
          return acc + (ref as HTMLElement).offsetHeight;
        }
        return acc;
      }, 0);
      setLayoutHeight(totalHeight);
    }, 500);

    window.addEventListener('resize', handleResize);

    if (Object.keys(refs.current).length) {
      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [Object.keys(refs.current).length]);

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
      <Box
        ref={(refAppBar) => {
          if (
            !Object.prototype.hasOwnProperty.call(refs.current, 'topAppBar')
          ) {
            refs.current = { ...refs.current, topAppBar: refAppBar };
          }
        }}
      >
        {showTopAppBar && (
          <Box
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
                logoUrl={atreeLogo?.src || ''}
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
                actionIcons={topAppBarIcons}
                menuIconClick={() => setIsDrawerOpen(true)}
                // profileIcon={[
                //   {
                //     icon: <>hi</>,
                //     ariaLabel: 'Help',
                //   },
                // ]}
                // onLogoutClick={(event) => action.onLogoutClick(event)}
                {...showTopAppBar}
              />
            </Box>
          </Box>
        )}

        {showBack && backIconClick && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              padding: '12px 16px',
              bgcolor: '#FFFFFF',
              gap: 2,
            }}
            onClick={backIconClick}
          >
            <ArrowBackIcon />
            <Typography fontSize={'22px'} fontWeight={400}>
              {backTitle}
            </Typography>
          </Box>
        )}
      </Box>
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
      <Loader isLoading={isLoadingChildren} layoutHeight={layoutHeight}>
        {children}
      </Loader>

      {isFooter && (
        <Box
          ref={(refFoot) => {
            if (!Object.prototype.hasOwnProperty.call(refs.current, 'footer')) {
              refs.current = { ...refs.current, footer: refFoot };
            }
          }}
          sx={{
            width: '100%',
            bgcolor: 'white',
            ..._footer,
          }}
        >
          {footerComponent || (
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
          )}
        </Box>
      )}
    </Box>
  );
}
