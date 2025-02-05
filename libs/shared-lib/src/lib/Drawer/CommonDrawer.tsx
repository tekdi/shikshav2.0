import React from 'react';
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
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
}

export const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onDrawerClose,
  items,
  onItemClick,
  categories,
}) => {
  return (
    <Drawer anchor="left" open={open} onClose={onDrawerClose}>
      <List>
        <Typography
          fontSize={'14px'}
          color="#49454F"
          sx={{ padding: '8px 16px' }}
        >
          Main menu
        </Typography>
        {items.map((item, index) => (
          <ListItemButton key={item.text} onClick={() => onItemClick(item.to)}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <Divider />
        <Typography
          fontSize={'14px'}
          color="#6750A4"
          sx={{ padding: '8px 16px' }}
        >
          All Categories
        </Typography>
        {categories.map((item, index) => (
          <ListItemButton key={item.text} onClick={() => onItemClick(item.to)}>
            <ListItemText primary={item.text} sx={{ marginRight: '30px' }} />
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
