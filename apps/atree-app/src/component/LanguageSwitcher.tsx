import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  LANGUAGE_LABELS,
  LANGUAGES,
  DEFAULT_LANGUAGE,
} from '../utils/language.constants';

// Client-side only wrapper to prevent hydration issues
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { i18n, ready } = useTranslation('common');
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // Get saved language from localStorage or use current i18n language or default
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const currentLanguage = savedLanguage || i18n.language || DEFAULT_LANGUAGE;

    // Ensure the language is valid
    const validLanguage = [LANGUAGES.ENGLISH, LANGUAGES.HINDI].includes(
      currentLanguage as any
    )
      ? currentLanguage
      : DEFAULT_LANGUAGE;

    setLanguage(validLanguage);

    // If the saved language is different from current i18n language, change it
    if (i18n.language !== validLanguage) {
      i18n.changeLanguage(validLanguage);
    }
  }, [i18n]);

  // Don't render until translations are ready
  if (!ready) {
    return null;
  }

  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    try {
      const newLanguage = event.target.value;
      setLanguage(newLanguage);

      // Save the selected language to localStorage
      localStorage.setItem('selectedLanguage', newLanguage);

      // Change the language using i18n
      await i18n.changeLanguage(newLanguage);

      // Update HTML lang attribute
      document.documentElement.lang = newLanguage;

      // Dispatch custom event to notify other components about language change
      window.dispatchEvent(
        new CustomEvent('languageChanged', { detail: newLanguage })
      );

      // Force a re-render by updating the URL without navigation
      const currentPath = router.asPath;
      const currentQuery = router.query;

      // Update the URL to trigger a re-render without full page navigation
      await router.replace(
        {
          pathname: router.pathname,
          query: { ...currentQuery, lang: newLanguage },
        },
        currentPath,
        {
          shallow: true,
          locale: newLanguage,
        }
      );

      // Remove the lang parameter from URL after a short delay to keep it clean
      setTimeout(() => {
        if (router.query.lang) {
          const { lang, ...cleanQuery } = router.query;
          router.replace(
            {
              pathname: router.pathname,
              query: cleanQuery,
            },
            router.asPath,
            { shallow: true }
          );
        }
      }, 100);
    } catch (error) {
      console.error('Error changing language:', error);
      // Revert to default language on error
      setLanguage(DEFAULT_LANGUAGE);
      localStorage.setItem('selectedLanguage', DEFAULT_LANGUAGE);
    }
  };

  return (
    <ClientOnly>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          height: '32px',
          position: 'relative',
        }}
      >
        <FormControl size="small" sx={{ width: { xs: 100, sm: 120 } }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                py: 0.5,
                px: 1,
                fontSize: '14px',
                height: '32px !important',
                minHeight: '32px !important',
                lineHeight: '32px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              height: 32,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    height: '32px',
                    minHeight: '32px !important',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  marginTop: 1,
                  marginBottom: 1,
                },
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
          >
            <MenuItem
              value={LANGUAGES.ENGLISH}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                height: '32px',
                padding: '4px 8px',
              }}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '14px',
                  lineHeight: '24px',
                }}
              >
                {LANGUAGE_LABELS[LANGUAGES.ENGLISH]}
              </Typography>
            </MenuItem>
            <MenuItem
              value={LANGUAGES.HINDI}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                height: '32px',
                padding: '4px 8px',
              }}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '14px',
                  lineHeight: '24px',
                }}
              >
                {LANGUAGE_LABELS[LANGUAGES.HINDI]}
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </ClientOnly>
  );
};

export default LanguageSwitcher;
