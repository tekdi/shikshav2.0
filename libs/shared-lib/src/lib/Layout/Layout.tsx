import React from 'react';
import Box from '@mui/material/Box';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { TopAppBar } from '../Header/TopAppBar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
interface LayoutProps {
  children: React.ReactNode;
  isFooter?: boolean;
  showBack?: boolean;
  showLogo?: boolean;
  showTopAppBar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isFooter,
  showBack,
  showLogo,
  showTopAppBar,
}) => {
  const handleButtonClick = () => {
    alert('Footer button clicked!');
  };
  const handleNotificationsClick = () =>
    console.log('Notifications icon clicked');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'grey',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          display: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        {/* <Header showLogo={showLogo} showBack={showBack} /> */}
        {showTopAppBar && (
          <Box
            sx={{
              width: '100%',
              bgcolor: 'white',
            }}
          >
            <TopAppBar
              title="Dashboard"
              actionIcons={[
                {
                  icon: <NotificationsIcon />,
                  ariaLabel: 'Notifications',
                  onClick: handleNotificationsClick,
                },
                {
                  icon: <AccountCircleIcon />,
                  ariaLabel: 'Account',
                  onClick: handleNotificationsClick,
                },
              ]}
            />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          width: '100%',
          // width: { xs: '90%', sm: '80%' },
          borderRadius: 1,
          bgcolor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          mx: 'auto',
        }}
      >
        {children}
      </Box>

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
