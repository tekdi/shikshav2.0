import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
interface DrawerItem {
  text: string;
  icon?: React.ReactNode;
  to: string;
}

interface CategoryItem {
  text: string;
  icon?: React.ReactNode;
  to: string;
  subCategories?: CategoryItem[];
}

interface CommonDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  items: DrawerItem[];
  categories: CategoryItem[];
  onItemClick: (to: string) => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
}

export const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onDrawerClose,
  items,
  onItemClick,
  categories,
  ...props
}) => {
  const [openDrawer, setOpenDrawer] = useState<
    'main' | 'category' | 'subcategory'
  >('main');
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(
    null
  );
  const [currentSubcategory, setCurrentSubcategory] =
    useState<CategoryItem | null>(null);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');

    if (storedRole) {
      setRole(storedRole);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleCategoryClick = (category: CategoryItem) => {
    if (category.subCategories) {
      setCurrentCategory(category);
      setOpenDrawer('category');
    } else {
      onItemClick(category.to);
    }
  };

  const handleSubcategoryClick = (subcategory: CategoryItem) => {
    if (subcategory.subCategories) {
      setCurrentSubcategory(subcategory);
      setOpenDrawer('subcategory');
    } else {
      onItemClick(subcategory.to);
    }
  };

  const handleBack = () => {
    if (openDrawer === 'subcategory') {
      setOpenDrawer('category');
      setCurrentSubcategory(null);
    } else {
      setOpenDrawer('main');
      setCurrentCategory(null);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onDrawerClose}
      {...props}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          width: '100vw',
          height: '100vh',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
        <IconButton
          sx={{
            color: '#fff',
            fontSize: '51.5px', // Increases the icon size
            padding: '12px', // Increases button padding for better click area
            '& .MuiSvgIcon-root': {
              fontSize: '51.5px', // Specifically increases the CloseIcon size
            },
          }}
          onClick={onDrawerClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80%',
          mt: -6,
          '@media (max-width: 600px)': {
            alignItems: 'center',
          },
        }}
      >
        <List
          sx={{
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            fontSize: '20px',
          }}
        >
          {openDrawer === 'main' && username && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 2,
                mb: 2,
                ml: '14px',
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#ffbd0d',
                  color: '#000000',
                }}
              >
                {username?.charAt(0).toUpperCase() ?? ''}
              </Avatar>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}
                >
                  {username}
                </Typography>
                <Typography sx={{ color: '#ccc', fontSize: '14px' }}>
                  {role}
                </Typography>
              </Box>
            </Box>
          )}

          {openDrawer === 'main' &&
            items.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => onItemClick(item.to)}
              >
                {item.icon && (
                  <ListItemIcon sx={{ color: '#fff' }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                  primary={item.text}
                />
              </ListItemButton>
            ))}

          {openDrawer === 'main' &&
            categories.map((category) => (
              <ListItemButton
                key={category.text}
                onClick={() => handleCategoryClick(category)}
              >
                <ListItemText primary={category.text} />
                {category.subCategories && <ArrowForwardIcon />}
              </ListItemButton>
            ))}

          {/* Render Category Subcategories */}
          {openDrawer === 'category' &&
            currentCategory?.subCategories?.map((subcategory) => (
              <ListItemButton
                key={subcategory.text}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <ListItemText primary={subcategory.text} />
                {subcategory.subCategories && <ArrowForwardIcon />}
              </ListItemButton>
            ))}

          {/* Render Subcategory Subcategories */}
          {openDrawer === 'subcategory' &&
            currentSubcategory?.subCategories?.map((subSubcategory) => (
              <ListItemButton
                key={subSubcategory.text}
                onClick={() => onItemClick(subSubcategory.to)}
              >
                <ListItemText primary={subSubcategory.text} />
              </ListItemButton>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};
