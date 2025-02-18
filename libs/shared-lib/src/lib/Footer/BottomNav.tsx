import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// Define the navigation item type
interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

// Define props for the component
interface BottomNavProps {
  items: NavItem[];
  width?: number | string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, width = 500 }) => {
  const [value, setValue] = React.useState(0);
  return (
    <Box sx={{ width }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          // navigate(items[newValue].path); // Navigate on change
        }}
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        {items.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              color: 'gray', // Default icon color
              '&.Mui-selected': {
                color: 'blue', // Selected icon color
              },
              '&:hover': {
                color: 'darkblue', // Hover color
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

// Example usage
