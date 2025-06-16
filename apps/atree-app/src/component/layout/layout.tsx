import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  debounce,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import { CommonDialog, CommonDrawer, Loader } from '@shared-lib';
import React, { useEffect, useRef, useState } from 'react';
import atreeLogo from '../../../assets/images/atreeLogo.svg';
import TopAppBar from './TopToolBar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { useRouter } from 'next/router';
import TermsAndCondition from '../TermsAndCondition';
import { useKeycloak } from '@react-keycloak/web';
import { deleteUserAccount } from '../../service/content';
import ShareIcon from '@mui/icons-material/Share';
import ShareDialog from '../ShareDialog';
import FooterText from '../FooterText';

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
  showTopAppBar?:
    | boolean
    | {
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

// Helper function to detect iOS
const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const refs = useRef({});
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { keycloak } = useKeycloak();
  const [frameworkData, setFrameworkData] = useState<any>(null);
  const [frameworkFilter, setFrameworkFilter] = useState<any[]>([]);
  const [framework, setFramework] = useState<string>('');
  const isAuthPage =
    router.pathname === '/signin' || router.pathname === '/register';
  const bottomFooter =
    router.pathname === '/searchpage' || router.pathname === '/contents';

  useEffect(() => {
    let isMounted = true;
    const fetchFrameworkData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        if (isMounted) {
          const frameworks = frameworkData?.result?.framework?.categories;
          const fdata =
            frameworks.find((item: any) => item.code === 'topic')?.terms ?? [];
          setFramework(fdata[0]?.identifier ?? '');
          setFrameworkFilter(fdata);
          setFrameworkData(frameworkData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching board data:', error);
        }
      }
    };

    fetchFrameworkData();
    return () => {
      isMounted = false;
    };
  }, []);

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
    ...(!token
      ? [
          {
            text: 'Login',
            icon: <AccountCircleOutlinedIcon fontSize="small" />,
            to: '/signin',
          },
        ]
      : []),
    {
      text: 'About Us',
      icon: <ParkOutlinedIcon fontSize="small" />,
      to: '/aboutus',
    },
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
    ...(token
      ? [
          {
            text: 'Logout',
            icon: <AccountCircleOutlinedIcon fontSize="small" />,
            to: '/signin',
          },
        ]
      : []),
  ];

  const handleOpen = () => setOpen(true);

  const clearAllStorage = () => {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie.trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    });

    // Clear Keycloak specific storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('kc-') || key.startsWith('keycloak')) {
        localStorage.removeItem(key);
      }
    });
  };

  const performLogout = async () => {
    try {
      clearAllStorage();

      if (isIOS()) {
        // For iOS, we need to do a full page reload after logout
        localStorage.setItem('performing_logout', 'true');
        await keycloak.logout({ redirectUri: window.location.origin });
        window.location.href = window.location.origin;
      } else {
        await keycloak.logout({ redirectUri: window.location.origin });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback to hard redirect if logout fails
      window.location.href = window.location.origin;
    }
  };

  const handleItemClick = async (to: string) => {
    if (to === 'delete-account') {
      setOpenDeleteDialog(true);
      return;
    }

    if (to.startsWith('http')) {
      window.open(to, '_blank');
      return;
    }

    if (to === '/signin') {
      if (token) {
        await performLogout();
      } else {
        router.push('/signin');
      }
      return;
    }

    router.push(to);
  };

  const handleCloseDeleteDialog = async () => {
    setOpenDeleteDialog(false);
    const accToken = localStorage.getItem('token') ?? '';
    const userId = localStorage.getItem('userId') ?? '';

    try {
      const deleteResponse = await deleteUserAccount({
        token: accToken,
        userId: userId,
      });

      if (deleteResponse?.responseCode === 200) {
        setOpenDeleteMessageDialog(true);
        await performLogout();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
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
        {Boolean(showTopAppBar) && (
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
                logoUrl={atreeLogo?.src ?? ''}
                _appBar={{
                  py: { xs: '10px', md: '30.5px' },
                  backgroundColor: '#fff',
                }}
                _title={{
                  fontWeight: 500,
                  fontSize: '24px !important',
                  color: '#000000',
                  fontFamily: 'Poppins',
                  textAlign: 'center',
                }}
                _isDrawer={isDrawer}
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
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                frameworkData={frameworkData}
                frameworkFilter={frameworkFilter}
                framework={framework}
                setFramework={setFramework}
                {...(typeof showTopAppBar === 'object' ? showTopAppBar : {})}
              />
            </Box>
          </Box>
        )}
        {(showBack || backTitle) && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              p: 2,
              bgcolor: '#FFFFFF',
              gap: 2,
              ...(_backButton || {}),
            }}
          >
            {showBack && (
              <IconButton onClick={backIconClick ?? console.log} sx={{ p: 0 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexGrow: 1,
                gap: 2,
              }}
            >
              {typeof backTitle === 'string' ? (
                <Typography
                  fontSize={'22px'}
                  fontWeight={700}
                  fontFamily={'Manrope, sans-serif'}
                >
                  {backTitle}
                </Typography>
              ) : (
                backTitle
              )}
              {!isMobile && (
                <IconButton
                  onClick={handleOpen}
                  color="primary"
                  sx={{
                    backgroundColor: 'white',
                    color: '#2B3133',
                    boxShadow:
                      '-0.73px 0.73px 0.73px -1.46px rgba(255, 255, 255, 0.35) inset, 0px 8px 10px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <ShareIcon />
                </IconButton>
              )}
            </Box>
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
            handleItemClick(to ?? '');
            setIsDrawerOpen(false);
          }}
        />
      )}

      <Loader isLoading={isLoadingChildren} layoutHeight={layoutHeight}>
        {children}
      </Loader>

      {!isAuthPage && bottomFooter && <FooterText page="" />}

      {/* Delete Account Confirmation Dialog */}
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
                color: '#000000',
                width: '100%',
                height: '40px',
                textTransform: 'none',
                marginRight: '20px',
                background: '#fcd804',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                color: '#000000',
                width: '100%',
                height: '40px',
                marginRight: '20px',
                background: '#fcd804',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              No
            </Button>
          </Box>
        }
        sx={{
          width: '500px',
          padding: '10px',
          borderRadius: '16px',
          height: '206px',
        }}
      />

      <ShareDialog open={open} handleClose={() => setOpen(false)} />

      {/* Delete Success Message Dialog */}
      <CommonDialog
        isOpen={openDeleteMessageDialog}
        onClose={() => {
          setOpenDeleteMessageDialog(false);
          router.push('/');
        }}
        disableCloseOnBackdropClick={true}
        header="User Details"
        hideCloseButton={true}
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              User account deleted successfully!
            </Typography>
          </Box>
        }
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => setOpenDeleteMessageDialog(false)}
              sx={{
                color: '#000000',
                width: '100%',
                height: '40px',
                marginRight: '20px',
                background: '#fcd804',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              Okay
            </Button>
          </Box>
        }
        sx={{
          width: '500px',
          height: '190px',
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
                color: '#000000',
                width: '100%',
                height: '40px',
                background: '#fcd804',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'none',
                fontFamily: 'Poppins',
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
