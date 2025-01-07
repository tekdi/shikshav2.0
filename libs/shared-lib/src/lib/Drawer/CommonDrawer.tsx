import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
interface DrawerItem {
  text: string;
  icon?: React.ReactNode;
  to: string;
}

interface CommonDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  items: DrawerItem[];
}

export const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onDrawerClose,
  items,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (to: string) => {
    navigate(to);
    onDrawerClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onDrawerClose}>
      <List>
        {items.map((item, index) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleItemClick(item.to)}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
