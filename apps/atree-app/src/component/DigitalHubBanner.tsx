import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_KEYS } from '../utils/language.constants';
import { useAppTranslation } from '../utils/i18n.helper';

const DigitalHubBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n, ready } = useAppTranslation();
  const [mounted, setMounted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      console.log(
        'Language change detected in DigitalHubBanner:',
        event.detail
      );
      setForceUpdate((prev) => prev + 1);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedLanguage' && event.newValue) {
        console.log(
          'Language change detected via storage in DigitalHubBanner:',
          event.newValue
        );
        setForceUpdate((prev) => prev + 1);
      }
    };

    window.addEventListener(
      'languageChanged' as any,
      handleLanguageChange as any
    );
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(
        'languageChanged' as any,
        handleLanguageChange as any
      );
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Force re-render when language changes
  useEffect(() => {
    console.log('DigitalHubBanner force update triggered:', forceUpdate);
  }, [forceUpdate]);

  // Default text in case translations aren't ready
  const defaultText = "India's digital hub for environment education resources";
  const displayText =
    mounted && ready ? t(LANGUAGE_KEYS.DIGITAL_HUB_BANNER) : defaultText;

  // Add forceUpdate to the key to force re-render
  return (
    <Box
      key={`banner-${forceUpdate}`}
      sx={{
        width: '100%',
        backgroundColor: '#fcd804',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 1,
        py: isMobile ? 1 : 1.5,
        textAlign: 'center',
        overflowX: 'auto', // Add horizontal scroll if needed at high zoom
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 700,
          fontSize: {
            xs: 'clamp(12px, 2vw, 18px)',
            sm: 'clamp(14px, 3vw, 24px)',
            md: 'clamp(20px, 2vw, 32px)',
            lg: '36px',
          },
          lineHeight: 1.2,
          color: '#2B3133',
          whiteSpace: 'nowrap', // Prevent line break
        }}
      >
        {displayText}
      </Typography>
    </Box>
  );
};

export default DigitalHubBanner;
