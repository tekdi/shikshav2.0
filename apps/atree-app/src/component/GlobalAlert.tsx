// components/GlobalAlert.tsx
import { Alert, Box } from '@mui/material';

type GlobalAlertProps = {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
};

const GlobalAlert = ({ message, severity, onClose }: GlobalAlertProps) => {
  if (!message) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      sx={{
        pointerEvents: 'none',
        bgcolor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <Alert
        variant="filled"
        severity={severity}
        sx={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default GlobalAlert;
