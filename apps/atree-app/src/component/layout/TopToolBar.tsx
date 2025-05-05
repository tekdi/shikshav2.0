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
  InputBase,
  Menu,
  MenuItem,
  Select,
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
  frameworkData?: any;
  frameworkFilter?: any[];
  framework?: string;
  setFramework?: (framework: string) => void;
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
  frameworkData,
  frameworkFilter = [],
  framework = '',
  setFramework,
}) => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [frameworkFilter, setFrameworkFilter] = useState();
  // const [framework, setFramework] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthPage =
    router.pathname === '/signin' || router.pathname === '/register';
  const languages = [
    'English',
    'Hindi',
    'Marathi',
    'Bengali',
    'Assamese',
    'Kannada',
    'Tamil',
    'Malayalam',
  ];
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  React.useEffect(() => {
    const lang = localStorage.getItem('language') ?? 'English';
    setSelectedLanguage(lang);
  }, []);
  useEffect(() => {
    if (window.location.pathname === '/') {
      localStorage.removeItem('language');
    }
    const storedLang = localStorage.getItem('language') ?? 'English';
    setSelectedLanguage(storedLang);
  }, []);
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
  }, [framework, frameworkFilter]);
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
  //       const frameworkData = await fetch(url).then((res) => res.json());
  //       const frameworks = frameworkData?.result?.framework?.categories;
  //       const fdata =
  //         frameworks.find((item: any) => item.code === 'topic')?.terms || [];
  //       setFramework(fdata[0]?.identifier || '');
  //       setFrameworkFilter(fdata);
  //     } catch (error) {
  //       console.error('Error fetching board data:', error);
  //     }
  //   };
  //   init();
  // }, []);
  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleLanguageSelect = (e: any) => {
    const lang = e.target.value;

    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);

    router.push('/contents');
  };
  const handleLanguageClick = (e: any) => {
    router.push('/contents');
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        component="nav"
        sx={{
          boxShadow: '0px 2px 2px 0px #00000040',
          ..._appBar,
          minHeight: { xs: '10px', md: '95px' },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box display={'flex'}>
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
                        width: { xs: '64px', md: '91px' },
                        height: { xs: '65px', md: '91px' },
                        marginTop: { md: '15px' },
                      }}
                    />
                  </Box>
                )}
                {!isMobile && !isAuthPage && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {frameworkFilter && setFramework && (
                      <FrameworkFilter
                        frameworkFilter={frameworkFilter || []}
                        framework={framework}
                        setFramework={setFramework}
                        fromSubcategory={false}
                      />
                    )}
                  </Box>
                )}

                <Typography
                  component="div"
                  sx={{
                    flexGrow: 1,
                    fontSize: '14px',
                    fontWeight: 400,
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
            {_isDrawer && (
              <Box display="flex" alignItems="center">
                {!isMobile ? (
                  <Box
                    sx={{
                      position: 'fixed',
                      right: 0,
                      marginTop: { md: '60px' },
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      paddingRight: '16px',
                      zIndex: 1100,
                    }}
                  >
                    {/* 🔍 Search Box */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: { xs: '180px', md: '238px' },
                        height: '40px',
                        borderRadius: '28px',
                        border: '1px solid #ccc',
                        paddingLeft: '12px',
                        backgroundColor: '#E9E7EF',
                        flexShrink: 0, // Prevent from shrinking when sibling grows
                      }}
                    >
                      <SearchIcon
                        sx={{ color: 'text.secondary', marginRight: '8px' }}
                      />
                      <InputBase
                        placeholder="Search for resources..."
                        onClick={handleSearchOpen}
                        sx={{ flex: 1 }}
                        readOnly
                      />
                    </Box>

                    {/* 🌐 Language Selector */}
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        height: '32px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '0 8px',
                        width: '120px', // Fixed width
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <Select
                        value={selectedLanguage}
                        onChange={handleLanguageSelect}
                        onClick={() => handleLanguageClick(selectedLanguage)}
                        displayEmpty
                        sx={{
                          width: '100%',
                          fontSize: '16px',
                          color: '#42474E',
                          '.MuiOutlinedInput-notchedOutline': { border: 0 },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 0,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 0,
                          },
                          '.MuiSelect-select': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            padding: '0px',
                          },
                        }}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang} value={lang}>
                            {lang}
                          </MenuItem>
                        ))}
                      </Select>
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
                      position: 'fixed',
                      right: 0,
                      marginTop: '50px',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: '16px',
                      zIndex: 1100,
                    }}
                  >
                    <IconButton
                      size="large"
                      edge="start"
                      sx={{ color: 'text.secondary' }}
                      aria-label="search"
                      onClick={handleSearchOpen}
                    >
                      <SearchIcon />
                    </IconButton>

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
