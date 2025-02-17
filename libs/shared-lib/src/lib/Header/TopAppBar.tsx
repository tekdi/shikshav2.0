import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase, Menu, MenuItem } from '@mui/material';
import Logo from '../../assets/images/Profile.png';
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
  ariaLabel: string;
  anchorEl?: HTMLElement | null;
  onLogoutClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

interface CommonAppBarProps {
  title?: string;
  showSearch: boolean;
  subtitle?: string;
  type?: 'Image' | 'card' | undefined;
  logo?: React.ReactNode;
  showMenuIcon?: boolean;
  showBackIcon?: boolean;
  menuIconClick?: () => void;
  backIconClick?: () => void;
  actionButtonLabel?: string;
  actionButtonClick?: () => void;
  actionButtonColor?: 'inherit' | 'primary' | 'secondary' | 'default';
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  color?: 'primary' | 'secondary' | 'default' | 'transparent' | 'inherit';
  actionIcons?: ActionIcon[];
  profileIcon?: ProfileIcon[];
  bgcolor?: string;
  onMenuClose?: () => void;
  onOptionClick?: () => void;
}

export const TopAppBar: React.FC<CommonAppBarProps> = ({
  title = 'Title',
  subtitle = '',
  type = 'card',
  logo,
  showMenuIcon = true,
  showBackIcon = false,
  showSearch,
  menuIconClick,
  backIconClick,
  onMenuClose,
  onOptionClick,
  actionButtonLabel = 'Action',
  actionButtonClick,
  actionButtonColor = 'inherit',
  position = 'static',
  color = 'transparent',
  actionIcons = [],
  profileIcon = [],
  bgcolor = '#FDF7FF',
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const accountIcon = actionIcons.find((icon) => icon.ariaLabel === 'Account');
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        component="nav"
        color={color}
        sx={{
          boxShadow: 'none',
          bgcolor,
          paddingTop: '10px',
        }}
      >
        <Toolbar>
          {type === 'Image' ? (
            <>
              {/* Left: Logo */}
              {logo && <Box sx={{ marginRight: 2 }}>{logo}</Box>}
              {showBackIcon && (
                <>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    onClick={backIconClick}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                </>
              )}
              {/* Center: Title + Subtitle */}

              {!searchOpen ? (
                <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                  <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                  {subtitle && (
                    <Typography color="red" textAlign={'left'}>
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  <InputBase
                    placeholder="Search..."
                    sx={{
                      flexGrow: 1,
                      marginLeft: 2,
                      bgcolor: '#fff',
                      padding: 1,
                      borderRadius: 1,
                    }}
                  />
                  <IconButton onClick={() => setSearchOpen(false)}>
                    <SearchIcon />
                  </IconButton>
                </Box>
              )}

              {/* Right: Search + Menu Icon */}
              {showSearch && (
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <SearchIcon />
                </IconButton>
              )}

              {showMenuIcon && (
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={menuIconClick}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </>
          ) : (
            <>
              {/* Card View */}
              {showMenuIcon && (
                <>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    onClick={menuIconClick}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    component="div"
                    sx={{
                      flexGrow: 1,
                      textAlign: 'center',
                      fontSize: '22px',
                      fontWeight: 400,
                    }}
                  >
                    {title}
                  </Typography>
                </>
              )}
              {showBackIcon && (
                <>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    onClick={backIconClick}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, textAlign: 'left' }}
                  >
                    {title}
                  </Typography>
                </>
              )}
              {profileIcon.length > 0 && (
                <IconButton
                  color={actionButtonColor}
                  aria-label={profileIcon[0]?.ariaLabel}
                  onClick={profileIcon[0]?.onLogoutClick}
                >
                  {profileIcon[0].icon}
                </IconButton>
              )}
            </>
          )}

          {/* Profile Icon
          { */}
        </Toolbar>
      </AppBar>

      {/* Search Input (only shown when search is open) */}

      {/* Profile Menu */}
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
