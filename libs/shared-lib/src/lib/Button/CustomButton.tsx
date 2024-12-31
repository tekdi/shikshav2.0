'use client';
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@shikshav2.0/ui-theme';
interface CustomButtonProps {
  label?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  borderRadius?: string;
  color?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  supportingText?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label = 'Continue',
  width = '328px',
  height = '40px',
  backgroundColor = '#6750A4',
  borderRadius = '50px',
  color = '#FFFFFF',
  fontSize = '16px',
  fontWeight = 'bold',
  supportingText = '',
  onClick,
  ...props
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          borderTop: '1px solid #0000004D',
          paddingTop: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          {...props}
          sx={{
            backgroundColor,
            borderRadius,
            width,
            height,
            textTransform: 'none',
            '&:hover': {
              backgroundColor,
            },
            color,
            fontSize,
            fontWeight,
          }}
          onClick={onClick}
        >
          {label}
        </Button>
        {supportingText && (
          <Typography
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            {supportingText}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};
