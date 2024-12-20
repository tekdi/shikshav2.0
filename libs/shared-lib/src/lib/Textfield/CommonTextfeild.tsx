'use client';
import React from 'react';
import { TextField } from '@mui/material';
import { CustomTypography } from '../Typography/CustomTypography';
interface CommonTextFieldProps {
  label: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  helperText?: string;
  error?: boolean;
  type?: string;
  variant?: string;
  width?: string;
  supportingText?: string;
  fullWidth?: boolean;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
}
export const CommonTextField: React.FC<CommonTextFieldProps> = ({
  label = 'Enter Text',
  value = 'Placeholder',
  onChange,
  type = 'text',
  variant = 'outlined',
  helperText = '',
  width = '328px',
  error = false,
  supportingText = '',
  fullWidth = true,
  fontSize = '14px',
  fontWeight = 400,
  color = '#000000',
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        variant={
          variant === 'standard' ||
          variant === 'filled' ||
          variant === 'outlined'
            ? variant
            : 'outlined'
        }
        fullWidth
        helperText={helperText}
        error={error}
        sx={{ width: width }}
        {...props}
      />
      {supportingText && (
        <CustomTypography
          variant="h1"
          fontSize={fontSize}
          color={color}
          fontWeight={fontWeight}
        >
          {supportingText}
        </CustomTypography>
      )}
    </div>
  );
};
