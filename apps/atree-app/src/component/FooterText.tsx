import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAppTranslation } from '../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../utils/language.constants';
import { useEffect, useState } from 'react';

type FooterTextProps = {
  readonly page?: string; // made optional in case it's not always passed
};

export default function FooterText({ page }: FooterTextProps) {
  const { t, i18n, ready } = useAppTranslation();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('Language change detected in FooterText:', event.detail);
      setForceUpdate((prev) => prev + 1);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedLanguage' && event.newValue) {
        console.log(
          'Language change detected via storage in FooterText:',
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

  return (
    <Grid
      key={`footer-${forceUpdate}`}
      sx={{
        px: 4,
        py: 1,
        background: '#fcd804',
      }}
    >
      <Typography
        align="center"
        gutterBottom
        fontFamily="poppins"
        sx={{ fontSize: { xs: '8px', md: '14px', fontWeight: 400 } }}
      >
        {t(LANGUAGE_KEYS.FOOTER_TEXT_PART1)}
        <Typography
          component="a"
          href="https://www.atree.org"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: { xs: '8px', md: '14px', fontWeight: 400 },
            // textDecoration: 'underline',
            color: 'inherit',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'white',
              textDecoration: 'underline',
            },
          }}
        >
          (ATREE)
        </Typography>
        {t(LANGUAGE_KEYS.FOOTER_TEXT_PART2)}
      </Typography>
    </Grid>
  );
}
