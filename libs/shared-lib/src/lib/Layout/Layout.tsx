import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Footer } from '../Footer/Footer';
import { TopAppBar } from '../Header/TopAppBar';
import { CommonSearch } from '../Search/CommonSearch';
import { CommonDrawer } from '../Drawer/CommonDrawer';
interface LayoutProps {
  children: React.ReactNode;
  isFooter?: boolean;
  showBack?: boolean;
  showLogo?: boolean;
  sx?: object;
  drawerItems?: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  }[];
  showSearch?: {
    placeholder: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
    inputValue?: string;
    onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sx?: object;
  };
  showTopAppBar?: {
    title?: string;
    showMenuIcon?: boolean;
    showBackIcon?: boolean;
    menuIconClick?: () => void;
    backIconClick?: () => void;
    actionButtonLabel?: string;
    actionButtonClick?: () => void;
    actionButtonColor?: 'inherit' | 'primary' | 'secondary' | 'default';
    position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
    color?: 'primary' | 'secondary' | 'default' | 'transparent' | 'inherit';
    actionIcons?: {
      icon: React.ReactNode;
      ariaLabel: string;
      onClick: () => void;
    }[];
  };
  topAppBarIcons?: {
    icon: React.ReactNode;
    ariaLabel: string;
    onClick: () => void;
  }[];
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isFooter,
  showBack,
  showLogo,
  showSearch,
  showTopAppBar,
  topAppBarIcons = [],
  drawerItems = [],
  sx = {},
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleButtonClick = () => {
    console.log('Footer button clicked!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        // bgcolor: 'grey',
        ...sx,
      }}
    >
      {/* <Header showLogo={showLogo} showBack={showBack} /> */}
      {showTopAppBar && (
        <Box
          sx={{
            // width: '100%',
            display: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            // padding: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              bgcolor: '#FFFFFF',
            }}
          >
            <TopAppBar
              title="Dashboard"
              bgcolor="#FDF7FF"
              actionIcons={topAppBarIcons}
              menuIconClick={() => setIsDrawerOpen(true)}
              {...showTopAppBar}
            />
          </Box>
        </Box>
      )}
      <CommonDrawer
        open={isDrawerOpen}
        onDrawerClose={() => setIsDrawerOpen(false)}
        items={drawerItems}
      />
      {showSearch && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '70px',
          }}
        >
          <CommonSearch
            placeholder={showSearch.placeholder || ''}
            leftIcon={showSearch.leftIcon ? showSearch.leftIcon : undefined}
            rightIcon={showSearch.rightIcon ? showSearch.rightIcon : undefined}
            onLeftIconClick={
              showSearch.leftIcon ? showSearch.onLeftIconClick : undefined
            }
            onRightIconClick={
              showSearch.rightIcon ? showSearch.onRightIconClick : undefined
            }
            inputValue={showSearch.inputValue || ''}
            onInputChange={showSearch.onInputChange}
            sx={showSearch.sx || { width: 400, marginTop: '8px' }}
          />
        </Box>
      )}
      {children}

      {isFooter && (
        <Box
          sx={{
            width: '100%',
            bgcolor: 'white',
          }}
        >
          <Footer
            buttonLabel="Continue"
            // buttonWidth="328px"
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
};
