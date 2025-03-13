import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, debounce, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { CommonDrawer, Loader } from '@shared-lib';
import React, { useEffect, useRef, useState } from 'react';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import TopAppBar from './TopToolBar';
import Footer from './Footer';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import FilterDramaOutlinedIcon from '@mui/icons-material/FilterDramaOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useRouter } from 'next/router';

import SearchTypeModal from '../SearchTypeModal';
import TermsAndCondition from '../TermsAndCondition';
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
  _backButton?: object;
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
  categorieItems = [],
  onItemClick,
  backIconClick,
  _backButton,
  sx = {},
  footerComponent,
  _footer,
}: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const refs = useRef({});
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
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
  const drawerItems = [
    { text: 'Home', icon: <HomeOutlinedIcon fontSize="small" />, to: '/home' },

    {
      text: 'Login',
      icon: <AccountCircleOutlinedIcon fontSize="small" />,
      to: '/signin',
    },
    {
      text: 'About Us',
      icon: <FilterDramaOutlinedIcon fontSize="small" />,
      to: '/aboutus',
    },
    {
      text: 'Contact Us',
      icon: <AlternateEmailOutlinedIcon fontSize="small" />,
      to: '/contactus',
    },
    {
      text: 'Recommend Resources',
      icon: <PostAddOutlinedIcon fontSize="small" />,
      to: '/content',
    },
    {
      text: 'Terms & Conditions',
      icon: <ContactSupportOutlinedIcon fontSize="small" />,
      to: '/termsAndCondition',
    },
  ];
  const handleItemClick = (to: string) => {
    if (to === '/termsAndCondition') {
      setOpenDialog(true);
    } else {
      router.push(to);
    }
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
                // title="Jal-Jungle-Jameen"
                _title={{
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: 'text.secondary',
                  fontWeight: 400,
                }}
                // subTitle="In Classrooms"
                _subTitle={{
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: 'text.primary',
                  fontWeight: 700,
                }}
                actionButtonColor="secondary"
                //@ts-ignore
                actionIcons={topAppBarIcons}
                menuIconClick={() => setIsDrawerOpen(true)}
                searchQuery={searchQuery} // Pass the search value
                onSearchChange={handleSearchChange}
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
        {(showBack || backTitle) && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              p: 2,
              bgcolor: '#FFFFFF',
              gap: 2,
              ...(_backButton || {}),
            }}
          >
            {showBack && (
              <ArrowBackIcon onClick={backIconClick || console.log} />
            )}
            {typeof backTitle === 'string' ? (
              <Typography fontSize={'22px'} fontWeight={400}>
                {backTitle}
              </Typography>
            ) : (
              backTitle
            )}
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
          handleItemClick?.(to || '');
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
          {footerComponent || <Footer />}
        </Box>
      )}

      {openDialog && (
        <TermsAndCondition
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          actions={
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                color: '#2B3133',
                width: '100%',
                height: '40px',
                background:
                  'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Close
            </Button>
          }
        />
      )}
    </Box>
  );
}
