import { Box, Typography } from '@mui/material';
import { useAppTranslation } from '../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../utils/language.constants';

export const TranslationTest = () => {
  const { t, i18n, ready } = useAppTranslation();

  if (!ready) {
    return <div>Loading translations...</div>;
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', m: 2 }}>
      <Typography variant="h6">Translation Test</Typography>
      <Typography>Current Language: {i18n.language}</Typography>
      <Typography>
        Welcome Message: {t(LANGUAGE_KEYS.WELCOME_MESSAGE)}
      </Typography>
      <Typography>Resources: {t(LANGUAGE_KEYS.RESOURCES)}</Typography>
      <Typography>Categories: {t(LANGUAGE_KEYS.CATEGORIES)}</Typography>
      <Typography>Sign In: {t(LANGUAGE_KEYS.SIGN_IN)}</Typography>
    </Box>
  );
};

export default TranslationTest;
