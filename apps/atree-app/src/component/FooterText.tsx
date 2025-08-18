import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_KEYS } from '../utils/language.constants';
type FooterTextProps = {
  readonly page?: string; // made optional in case it's not always passed
};
export default function FooterText({ page }: FooterTextProps) {
  const { t, i18n, ready } = useTranslation('common');

  return (
    <Grid
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
