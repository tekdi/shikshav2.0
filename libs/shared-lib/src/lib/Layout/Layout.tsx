//@ts-nocheck

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Footer } from '../Footer/Footer';
import { TopAppBar } from '../Header/TopAppBar';
import { CommonSearch } from '../Search/CommonSearch';
import { CommonDrawer } from '../Drawer/CommonDrawer';
import FilterDialog from '../Filterdialog/FilterDialog';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
interface LayoutProps {
  children: React.ReactNode;
  isFooter?: boolean;
  showBack?: boolean;
  backTitle?: string;
  showLogo?: boolean;
  showFilter?: boolean;
  sx?: object;
  categorieItems?: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  }[];
  drawerItems?: {
    text: string;
    to: string;
    icon?: React.ReactNode;
  }[];
  onItemClick?: (to: string) => void;
  backIconClick?: () => void;
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
  filter?: {
    sort?: boolean;
    language?: string[];
    subject?: string[];
    contentType?: string[];
  };
  currentSelectedValues?;
  language?: string;
  selectedSubjects?: string[];
  selectedContentTypes?: string[];
  sort?: any;
  onSubjectsChange?: (subjects: string) => void;
  onLanguageChange?: (language: string) => void;
  onContentTypeChange?: (contentType: string) => void;
  onSortChange?: (sort: any) => void;
  onApply?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isFooter,
  showBack,
  backTitle,
  showLogo,
  showSearch,
  showTopAppBar,
  showFilter,
  frameworkFilter,
  topAppBarIcons = [],
  drawerItems = [],
  categorieItems = [],
  onItemClick,
  backIconClick,
  filter,
  language,
  selectedSubjects,
  selectedContentTypes,
  sort,
  onLanguageChange,
  onSubjectsChange,
  onContentTypeChange,
  onSortChange,
  onApply,
  filterValues,
  sx = {},
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const handleButtonClick = () => {
    console.log('Footer button clicked!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // alignItems: 'center',
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
              profileIcon={showTopAppBar?.profileIcon}
              actionIcons={topAppBarIcons}
              menuIconClick={() => setIsDrawerOpen(true)}
              onLogoutClick={(event) => action.onLogoutClick(event)}
              showSearch={showTopAppBar.showSearch}
              {...showTopAppBar}
            />
          </Box>
        </Box>
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onDrawerClose={() => setIsDrawerOpen(false)}
        items={drawerItems}
        categories={categorieItems}
        onItemClick={(to) => {
          onItemClick?.(to);
          setIsDrawerOpen(false);
        }}
      />

      {showSearch && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
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
            sx={
              showSearch.sx || {
                width: 400,
                marginTop: '8px',
                marginLeft: '10px',
              }
            }
          />
          {showFilter && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#ECE6F0',
                borderRadius: '12px',
                // padding: '8px',
                width: '56px',
                height: '46px',
                '&:hover': {
                  backgroundColor: '#E0E0E0',
                  boxShadow: '0px 4px 8px 3px #00000026',
                },
                marginLeft: '4px',
                marginRight: '7px',

                boxShadow: '0px 1px 3px 0px #0000004D',
              }}
              onClick={() => setFilterShow(true)}
            >
              <FilterAltOutlinedIcon
                sx={{ color: '#6750A4', fontSize: '25px' }}
              />
            </Box>
          )}
        </Box>
      )}
      {/* Render Back Button Below the TopAppBar */}
      {showBack && backIconClick && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            bgcolor: '#FFFFFF',
            position: 'fixed', // Ensures it stays in view
            top: '55px', // Adjust based on TopAppBar's height
            zIndex: 1100, // Ensure it stays above other elements
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={backIconClick}
            sx={{
              textTransform: 'none',
              color: '#1E1B16',
              fontSize: '16px',
            }}
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              {backTitle}
            </Typography>
          </Button>
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
      {filterShow && (
        <FilterDialog
          open={filterShow}
          onClose={() => setFilterShow(false)}
          filter={filter}
          language={language ?? ''}
          selectedSubjects={selectedSubjects}
          selectedContentTypes={selectedContentTypes}
          sort={sort}
          onLanguageChange={onLanguageChange}
          onSubjectsChange={onSubjectsChange}
          onContentTypeChange={onContentTypeChange}
          onSortChange={onSortChange}
          onApply={onApply}
          frameworkFilter={frameworkFilter}
          filterValues={filterValues}
        />
      )}
    </Box>
  );
};
