import React from 'react';
import { Box } from '@mui/material';
import { CustomButton } from '../Button/CustomButton';

interface FooterProps {
  buttonLabel: string;
  buttonWidth?: string;
  buttonHeight?: string;
  buttonBackgroundColor?: string;
  buttonBorderRadius?: string;
  buttonColor?: string;
  buttonFontSize?: string | number;
  buttonFontWeight?: string | number;
  buttonSupportingText?: string;
  bottompx?: number;
  onButtonClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  buttonLabel = 'Click',
  buttonWidth = '328px',
  buttonHeight = '40px',
  buttonBackgroundColor = '#6750A4',
  buttonBorderRadius = '50px',
  buttonColor = '#FFFFFF',
  buttonFontSize = '16px',
  buttonFontWeight = 500,
  buttonSupportingText = 'Supporting text',
  bottompx = 0,
  onButtonClick,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        position: 'relative',
        bottom: bottompx,
        backgroundColor: '#F9F9F9',
      }}
    >
      <CustomButton
        label={buttonLabel}
        width={buttonWidth}
        height={buttonHeight}
        backgroundColor={buttonBackgroundColor}
        borderRadius={buttonBorderRadius}
        color={buttonColor}
        fontSize={buttonFontSize}
        fontWeight={buttonFontWeight}
        supportingText={buttonSupportingText}
        onClick={onButtonClick}
      />
    </Box>
  );
};
