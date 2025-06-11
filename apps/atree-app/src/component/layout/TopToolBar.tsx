import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchTypeModal from '../SearchTypeModal';
import { FrameworkFilter } from '../Tags';
import { useRouter } from 'next/router';
interface ActionIcon {
  icon: React.ReactNode;
  ariaLabel: string;
  anchorEl?: HTMLElement | null;
  onLogoutClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onOptionClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLLIElement, MouseEvent>
  ) => void;
}
interface ProfileIcon {
  icon: React.ReactNode;
  ariaLabel?: string;
  anchorEl?: HTMLElement | null;
  onLogoutClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}
interface CommonAppBarProps {
  title?: string;
  _title?: object;
  subTitle?: string;
  _subTitle?: object;
  showMenuIcon?: boolean;
  showBackIcon?: boolean;
  searchIconClick?: () => void;
  menuIconClick?: () => void;
  backIconClick?: () => void;
  actionButtonColor?: 'inherit' | 'primary' | 'secondary' | 'default';
  color?: 'primary' | 'secondary' | 'default' | 'transparent' | 'inherit';
  actionIcons?: ActionIcon[];
  profileIcon?: ProfileIcon[];
  bgcolor?: string;
  onMenuClose?: () => void;
  logoUrl?: string;
  _appBar?: object;
  searchQuery?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  _isDrawer?: boolean;
}
const TopAppBar: React.FC<CommonAppBarProps> = ({
  title,
  _title,
  subTitle,
  _subTitle,
  showBackIcon = false,
  menuIconClick,
  backIconClick,
  searchIconClick,
  actionButtonColor = 'inherit',
  actionIcons = [],
  profileIcon = [],
  onMenuClose,
  logoUrl,
  _appBar,
  _isDrawer,
}) => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [framework, setFramework] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthPage =
    router.pathname === '/signin' || router.pathname === '/register';

  useEffect(() => {
    if (framework) {
      if (frameworkFilter) {
        const subFrameworkData = (frameworkFilter as any).find(
          (item: any) => item.identifier === framework
        );
        localStorage.setItem(
          'category',
          subFrameworkData?.name
            ? subFrameworkData.name.charAt(0).toUpperCase() +
                subFrameworkData.name.slice(1).toLowerCase()
            : ''
        );
      }
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        const frameworks = frameworkData?.result?.framework?.categories;
        const fdata =
          frameworks.find((item: any) => item.code === 'topic')?.terms || [];
        setFramework(fdata[0]?.identifier || '');
        setFrameworkFilter(fdata);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };
    init();
  }, []);
  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };
  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        component="nav"
        sx={{
          boxShadow: '0px 2px 2px 0px #00000040',
          ..._appBar,
          height: { xs: '68px', md: '129px' },
          objectFit: 'contain',
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: '0px', md: '64px' },
            }}
          >
            <Box display={'flex'} alignItems="center" sx={{ height: '100%' }}>
              {showBackIcon && (
                <IconButton
                  size="large"
                  edge="start"
                  sx={{ color: 'text.secondary' }}
                  aria-label="back"
                  onClick={backIconClick}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Box>
                {logoUrl && (
                  <Box
                    onClick={() => (window.location.href = '/')}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'fixed',
                      left: 0,
                      transform: 'translateY(-50%)',
                      padding: '10px',
                      zIndex: 1000,
                    }}
                  >
                    <Box
                      component="img"
                      src={logoUrl}
                      alt="logo"
                      sx={{
                        width: { xs: '64px', md: '129px' },
                        height: { xs: '64px', md: '129px' },
                        objectFit: 'contain',
                        alignSelf: 'center',
                      }}
                    />
                  </Box>
                )}
                <Typography
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 500,
                    fontSize: '64px !important',
                    color: '#000000',
                    fontFamily: 'Poppins',
                    ..._title,
                  }}
                >
                  {title}
                </Typography>
                {subTitle && (
                  <Typography
                    component="div"
                    sx={{
                      flexGrow: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                      ..._subTitle,
                    }}
                  >
                    {subTitle}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Middle section with FrameworkFilter and Search */}
            <Box display="flex" alignItems="center" gap={2}>
              {!isMobile && (
                <Box
                  sx={{
                    // minWidth: '200px',
                    position: 'relative', // Adjust width as needed
                  }}
                >
                  <FrameworkFilter
                    frameworkFilter={frameworkFilter ?? []}
                    framework={framework}
                    setFramework={setFramework}
                    fromSubcategory={false}
                  />
                </Box>
              )}

              {_isDrawer && (
                <Box display="flex" alignItems="center">
                  {!isMobile && !isAuthPage ? (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        zIndex: 1100,
                      }}
                    >
                      {/* 🔍 Search Box */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { xs: '40px', md: '40px' },
                          height: '40px',
                          borderRadius: '28px',
                          cursor: 'pointer',
                        }}
                        onClick={handleSearchOpen}
                      >
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </Box>

                      {/* ☰ Menu Icon */}
                      <IconButton
                        size="large"
                        edge="start"
                        sx={{ color: 'text.secondary' }}
                        aria-label="menu"
                        onClick={menuIconClick}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 1100,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: 2,
                          py: '6px',
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: 'action.hover',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            cursor: 'text',
                          },
                          width: '100%',
                            maxWidth: '500px',
                          marginRight: '10px',
                        }}
                        onClick={handleSearchOpen}
                      >
                       

                        {/* Search icon */}
                        <SearchIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary' }}
                        />

                        {/* Search text */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            flexGrow: 1,
                            fontSize: 14,
                          }}
                        >
                          Search...
                        </Typography>
                      </Box>
                      <IconButton
                        size="large"
                        edge="start"
                        sx={{ color: 'text.secondary' }}
                        aria-label="menu"
                        onClick={menuIconClick}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Box>
                  )}
                  <SearchTypeModal
                    open={isSearchOpen}
                    onClose={handleSearchClose}
                    onSelect={(type) => console.log(type)}
                  />
                  {profileIcon && profileIcon.length > 0 && (
                    <IconButton
                      color={actionButtonColor}
                      aria-label={profileIcon[0]?.ariaLabel}
                      onClick={profileIcon[0]?.onLogoutClick}
                    >
                      {profileIcon[0].icon}
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {profileIcon[0]?.anchorEl && (
        <Menu
          id="menu-appbar"
          anchorEl={profileIcon[0].anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(profileIcon[0].anchorEl)}
          onClose={onMenuClose}
        >
          {actionIcons?.map((action, index) => (
            <MenuItem key={index} onClick={action?.onOptionClick}>
              <IconButton size="small" color="inherit">
                {action.icon}
              </IconButton>
              {action.ariaLabel}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};

export default React.memo(TopAppBar);
