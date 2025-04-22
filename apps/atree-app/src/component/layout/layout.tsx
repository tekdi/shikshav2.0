import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  debounce,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import { CommonDialog, CommonDrawer, Loader } from '@shared-lib';
import React, { useEffect, useRef, useState } from 'react';
import atreeLogo from '../../../assets/images/atreeLogo.svg';
import TopAppBar from './TopToolBar';
import Footer from './Footer';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { useRouter } from 'next/router';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import TermsAndCondition from '../TermsAndCondition';
import { useKeycloak } from '@react-keycloak/web';
import { deleteUserAccount } from '../../service/content';

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
  isDrawer?: boolean;
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
  isDrawer = true,
}: Readonly<LayoutProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const refs = useRef({});
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState(false); // [openDeleteMessageDialog]
  const router = useRouter();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const { keycloak } = useKeycloak();

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

  const drawerItems = [
    { text: 'Home', icon: <HomeOutlinedIcon fontSize="small" />, to: '/' },

    {
      text: token ? 'Logout' : 'Login',
      icon: <AccountCircleOutlinedIcon fontSize="small" />,
      to: '/signin',
    },
    {
      text: 'About Us',
      icon: <ParkOutlinedIcon fontSize="small" />,
      to: '/aboutus',
    },

    ...(!isMobile
      ? [
          {
            text: 'Quick Access',
            icon: <BookmarksOutlinedIcon fontSize="small" />,
            to: '/quick-access',
          },
        ]
      : []),
    {
      text: 'Recommend Resources',
      icon: <PostAddOutlinedIcon fontSize="small" />,
      to: 'https://forms.gle/j6RardUhmDN2yRfE6',
    },
    {
      text: 'Terms & Conditions',
      icon: <ContactSupportOutlinedIcon fontSize="small" />,
      to: '/termsandcondition',
    },
    {
      text: token ? (
        <Typography
          sx={{ color: '#ff0000', fontWeight: 700, fontSize: '20px' }}
        >
          Delete My Account
        </Typography>
      ) : null,
      icon: token ? (
        <DeleteOutlineOutlinedIcon sx={{ color: '#ff0000' }} fontSize="small" />
      ) : null,
      to: 'delete-account',
    },
  ];
  const handleItemClick = async (to: string) => {
    if (to === 'delete-account') {
      setOpenDeleteDialog(true);
      return; // prevent navigation!
    }
    if (to === 'delete-account') {
      setOpenDeleteDialog(true);
      const accToken = localStorage.getItem('token') || '';
      if (confirmDelete) {
        try {
          await deleteUserAccount({
            token: accToken,
          });
        } catch (error) {
          console.error('Error updating user status:', error);
          return error;
        }
      }
    }
    if (to.startsWith('http')) {
      // Open external links in a new tab
      window.open(to, '_blank');
      return;
    }
    if (to === '/signin') {
      if (token) {
        // If logged in, clear localStorage and log out
        localStorage.clear();
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('kc-callback-')) {
            localStorage.removeItem(key);
          }
        });

        keycloak.logout({
          redirectUri: window.location.origin, // Redirect to home page after logout
        });
        // Clear Google OAuth session (important for some cases)
        document.cookie =
          'g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/'); // Redirect to home on logout
      } else {
        // If not logged in, go to sign-in page
        router.push('/signin');
      }
    } else {
      router.push(to);
    }
  };
  const handleCloseDeleteDialog = async () => {
    setOpenDeleteDialog(false);
    const accToken = localStorage.getItem('token') || '';
    try {
      await deleteUserAccount({ token: accToken });

      // On success, show confirmation
      setOpenDeleteMessageDialog(true);

      // Perform logout cleanup
      // localStorage.clear();
      // sessionStorage.clear();
      // Object.keys(localStorage).forEach((key) => {
      //   if (key.startsWith('kc-callback-')) {
      //     localStorage.removeItem(key);
      //   }
      // });

      // keycloak.logout({ redirectUri: window.location.origin });
    } catch (error) {
      console.error('Error deleting account:', error);
      // Optional: show an error dialog
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        ...sx,
      }}
    >
      <Box sx={{ zIndex: 100, position: 'fixed', top: 0, left: 0, right: 0 }}>
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
                _isDrawer={isDrawer}
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
      {isDrawer && (
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
      )}

      <Loader isLoading={isLoadingChildren} layoutHeight={layoutHeight}>
        {children}
      </Loader>

      {isMobile && isFooter && (
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
      {!isMobile && footerComponent && (
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
          {footerComponent}
        </Box>
      )}
      <CommonDialog
        isOpen={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        disableCloseOnBackdropClick={true}
        header="User Details"
        hideCloseButton={true}
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              Are you sure you want to delete your account?{' '}
            </Typography>
          </Box>
        }
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleCloseDeleteDialog}
              sx={{
                color: '#2B3133',
                width: '100%',
                height: '40px',
                marginRight: '20px',
                background:
                  'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
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
              No
            </Button>
          </Box>
        }
        sx={{
          width: '500px',
          height: '300px',
          padding: '10px',
          borderRadius: '16px',
        }}
      />
      <CommonDialog
        isOpen={openDeleteMessageDialog}
        onClose={() => setOpenDeleteMessageDialog(false)}
        disableCloseOnBackdropClick={true}
        header="User Details"
        hideCloseButton={true}
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              User account deleted successfully !
            </Typography>
          </Box>
        }
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => setOpenDeleteMessageDialog(false)}
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
              Okay
            </Button>
          </Box>
        }
        sx={{
          width: '500px',
          height: '300px',
          padding: '10px',
          borderRadius: '16px',
        }}
      />
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
