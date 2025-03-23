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
import Image from 'next/image';
import SearchTypeModal from '../SearchTypeModal';
import { FrameworkFilter } from '../Tags';
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
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [framework, setFramework] = useState('');
  const [filterCategory, SetFilterCategory] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    if (framework) {
      if (frameworkFilter) {
        const subFrameworkData = (frameworkFilter as any).find(
          (item: any) => item.identifier === framework
        );

        SetFilterCategory(
          subFrameworkData?.name
            ? subFrameworkData.name.charAt(0).toUpperCase() +
                subFrameworkData.name.slice(1).toLowerCase()
            : ''
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
        const frameworksD = frameworkData?.result?.framework;
        const filteredFramework = {
          ...frameworksD,
          categories: frameworksD.categories.filter(
            (category: any) => category.status === 'Live'
          ),
        };

        const filters: any = {
          topic: filterCategory ? [filterCategory] : ['Water'],
        };

        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters,
        });
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
                    }}
                  >
                    <Image src={logoUrl} alt="logo" width={64} height={64} />
                  </Box>
                )}
                {!isMobile && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <FrameworkFilter
                      frameworkFilter={frameworkFilter || []}
                      framework={framework}
                      setFramework={setFramework}
                      fromSubcategory={false}
                    />
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
            <Box display="flex" alignItems="center">
              <IconButton
                size="large"
                edge="start"
                sx={{ color: 'text.secondary' }}
                aria-label="search"
                onClick={handleSearchOpen}
              >
                <SearchIcon />
              </IconButton>
              <SearchTypeModal
                open={isSearchOpen}
                onClose={handleSearchClose}
                onSelect={(type) => console.log(type)}
              />

              <IconButton
                size="large"
                edge="start"
                sx={{ color: 'text.secondary' }}
                aria-label="menu"
                onClick={menuIconClick}
              >
                <MenuIcon />
              </IconButton>

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
