import React, { useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
          boxShadow: '0px 2px 6px 2px #00000026, 0px 1px 2px 0px #0000004D',
          color: '#fff',
          width: '100vw', // Full width
          height: '100vh', // Full height
        },
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        {/* <Typography variant="h6">Menu</Typography> */}
        <IconButton sx={{ color: '#fff' }} onClick={onDrawerClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {/* Render Main Menu Items */}
        {openDrawer === 'main' &&
          items.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => onItemClick(item.to)}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              )}
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}

        {/* Render Main Categories */}
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
    </Drawer>
  );
};
