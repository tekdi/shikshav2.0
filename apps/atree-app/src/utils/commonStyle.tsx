import { SxProps } from '@mui/material';

export const commonStyles = {
  responsivePadding: {
    pl: { xs: 2, md: 10 },
    pr: { xs: 2, md: 10 },
  },
} as const;

export const commonButtonStyle: SxProps = {
  backgroundColor: '#ffffff',
  width: { xs: '80%', sm: '60%', md: '50%' },
  border: '1px solid #FFBD0D',
  height: '44px',
  borderRadius: '40px',
  color: '#000',
  textTransform: 'none',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: 'none',
  alignSelf: 'center',
  mx: 'auto',
  '&:hover': { backgroundColor: '#f5f5f5' },
};

export const primaryButtonStyle: SxProps = {
  color: '#2B3133',
  width: { xs: '80%', sm: '60%', md: '50%' },
  height: '44px',
  background: '#FFBD0D',
  borderRadius: '50px',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  alignSelf: 'center',
  mx: 'auto',
  '&:hover': {
    backgroundColor: '#E6A800',
  },
  '&:disabled': {
    backgroundColor: '#FFE699',
    color: '#2B3133',
  },
};
