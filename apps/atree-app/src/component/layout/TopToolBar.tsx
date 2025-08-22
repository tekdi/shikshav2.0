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
import LanguageSwitcher from '../LanguageSwitcher';
import { useRouter } from 'next/router';
import { useAppTranslation } from '../../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../../utils/language.constants';
import { ContentSearch } from '@shared-lib';
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
  const { t, ready } = useAppTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState<any[]>([]);
  const [framework, setFramework] = useState('');
  const [filterData, setFilterData] = useState<{
    authors: string[];
    publishers: string[];
    languages: string[];
  }>({
    authors: [],
    publishers: [],
    languages: [],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthPage =
    router.pathname === '/signin' || router.pathname === '/register';

  // Helper function to get framework value based on route
  const getFrameworkValue = () => {
    return router.pathname === '/' || router.pathname === '/index'
      ? ''
      : framework;
  };

  // Helper function to render drawer content based on conditions
  const renderDrawerContent = () => {
    if (!isMobile && !isAuthPage) {
      return (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            zIndex: 1100,
            justifyContent: 'flex-end',
            minWidth: { xs: '200px', sm: '300px' },
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

          {/* 🌐 Language Switcher */}
          <Box
            sx={{
              width: { xs: 100, sm: 120 },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <LanguageSwitcher />
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
      );
    }

    if (isAuthPage) {
      return (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            zIndex: 1100,
            justifyContent: 'flex-end',
            minWidth: { xs: '200px', sm: '300px' },
          }}
        >
          {/* 🔍 Search Box - Icon Only for Auth Pages */}
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

          {/* 🌐 Language Switcher */}
          <Box
            sx={{
              width: { xs: 100, sm: 120 },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <LanguageSwitcher />
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
      );
    }

    // Default case (mobile, non-auth page)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          zIndex: 1100,
          justifyContent: 'flex-end',
          minWidth: { xs: '200px', sm: '300px' },
          gap: 2,
        }}
      >
        {/* 🔍 Search Box - Icon Only for Mobile */}
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
        {/* 🌐 Language Switcher */}
        <Box
          sx={{
            width: { xs: 100, sm: 120 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <LanguageSwitcher />
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
    );
  };

  useEffect(() => {
    const init = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        console.log('Fetching framework data from:', url);

        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Framework API error: ${response.status}`);
          // Set default framework data
          setFrameworkFilter([
            {
              identifier: 'default',
              name: 'Default Category',
              code: 'topic',
            },
          ]);
          setFramework('default');
          return;
        }

        const frameworkData = await response.json();
        console.log('Framework data received:', frameworkData);

        const frameworks = frameworkData?.result?.framework?.categories || [];
        const fdata =
          frameworks.find((item: any) => item.code === 'topic')?.terms || [];

        if (fdata && fdata.length > 0) {
          // Check if we're on the landing page
          const isLandingPage =
            router.pathname === '/' || router.pathname === '/index';

          setFrameworkFilter(fdata);

          if (isLandingPage) {
            // On landing page, don't set any framework (empty selection)
            setFramework('');
          } else {
            // On other pages, apply saved selection only if it exists
            let selectedFramework = null;

            // Check if there's already a selected framework in localStorage
            const savedCategory = localStorage.getItem('category');

            if (savedCategory) {
              // Try to find the saved category in the framework data
              const foundFramework = fdata.find(
                (item: any) =>
                  item.name.toLowerCase() === savedCategory.toLowerCase()
              );
              if (foundFramework) {
                selectedFramework = foundFramework;
              }
            }

            // Only set framework if we have a saved selection
            setFramework(selectedFramework?.identifier || '');
          }
        } else {
          // Set default framework data if no valid data found
          setFrameworkFilter([
            {
              identifier: 'default',
              name: 'Default Category',
              code: 'topic',
            },
          ]);
          setFramework('default');
        }
      } catch (error) {
        console.error('Error fetching framework data:', error);
        // Set default framework data on error
        setFrameworkFilter([
          {
            identifier: 'default',
            name: 'Default Category',
            code: 'topic',
          },
        ]);
        setFramework('default');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (framework && frameworkFilter?.length > 0) {
      const subFrameworkData = frameworkFilter.find(
        (item: any) => item.identifier === framework
      );
      if (subFrameworkData?.name) {
        localStorage.setItem(
          'category',
          subFrameworkData.name.charAt(0).toUpperCase() +
            subFrameworkData.name.slice(1).toLowerCase()
        );
      }
    }
  }, [framework, frameworkFilter]);

  const handleSearchOpen = async () => {
    try {
      // Make API call to get all content for filtering
      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: {
          contentType: { ne: 'Asset' },
        },
        offset: 0,
      });

      const contentList = data?.result?.content || [];

      // Extract unique values for each filter type
      const authors = [
        ...new Set(
          contentList
            .map((item: any) => item.author)
            .filter(Boolean)
            .flatMap((creator: string) =>
              creator
                .split(',')
                .map((name: string) => name.trim())
                .filter(Boolean)
            )
        ),
      ];
      const publishers = [
        ...new Set(
          contentList
            .map((item: any) => item.publisher)
            .filter(Boolean)
            .flatMap((publisher: string) =>
              publisher
                .split(',')
                .map((name: string) => name.trim())
                .filter(Boolean)
            )
        ),
      ];
      // Handle language field which might be an array
      const languages = [
        ...new Set(
          contentList
            .flatMap((item: any) =>
              Array.isArray(item.language) ? item.language : [item.language]
            )
            .filter(Boolean)
            .flatMap((language: string) =>
              language
                .split(',')
                .map((lang: string) => lang.trim())
                .filter(Boolean)
            )
        ),
      ];

      setFilterData({
        authors,
        publishers,
        languages,
      });

      setIsSearchOpen(true);
    } catch (error) {
      console.error('Error fetching filter data:', error);
      setIsSearchOpen(true);
    }
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
        <Container
          maxWidth="xl"
          sx={{
            height: '100%',
            width: '100%',
            margin: '0 auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: '0px', md: '64px' },
            }}
          >
            <Box
              display={'flex'}
              alignItems="center"
              sx={{
                height: '100%',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
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
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                flex: '0 0 auto',
                minWidth: { xs: '200px', sm: '300px' },
                justifyContent: 'flex-end',
              }}
            >
              {!isMobile && (
                <Box
                  sx={{
                    minWidth: '200px',
                    position: 'relative',
                    flex: '1 1 auto',
                  }}
                >
                  <FrameworkFilter
                    frameworkFilter={frameworkFilter}
                    framework={getFrameworkValue()}
                    setFramework={setFramework}
                    fromSubcategory={false}
                  />
                </Box>
              )}

              {_isDrawer && (
                <Box display="flex" alignItems="center">
                  {renderDrawerContent()}
                </Box>
              )}
              <SearchTypeModal
                open={isSearchOpen}
                onClose={handleSearchClose}
                onSelect={(type) => console.log(type)}
                filterData={filterData}
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
