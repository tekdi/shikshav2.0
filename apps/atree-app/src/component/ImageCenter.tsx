import { Box } from '@mui/material';

export default function ImageCenter() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
      <img
        src="/images/atreeLogo.svg"
        alt="Logo"
        style={{
          width: '180px',
          height: 'auto',
        }}
      />
    </Box>
  );
}
