import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';

interface GlobalAlertProps {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  autoHide?: boolean;
  autoHideDuration?: number;
  showDelay?: number;
}

const GlobalAlert: React.FC<GlobalAlertProps> = ({
  message,
  severity,
  onClose,
  autoHide = true,
  autoHideDuration = 3000,
  showDelay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Add delay before showing the alert
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);

      if (autoHide) {
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }, showDelay + autoHideDuration);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }

      return () => clearTimeout(showTimer);
    } else {
      setIsVisible(false);
    }
  }, [message, autoHide, autoHideDuration, onClose, showDelay]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      position="fixed"
      top={24}
      left={0}
      right={0}
      sx={{
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <Alert
        variant="filled"
        severity={severity}
        sx={{
          pointerEvents: 'auto',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        onClick={() => {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default GlobalAlert;
