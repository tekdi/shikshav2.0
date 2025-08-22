import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useAppTranslation } from '../utils/i18n.helper';

interface ContentMetadataProps {
  contentData: any;
  isMobile?: boolean;
}

export const ContentMetadata: React.FC<ContentMetadataProps> = ({
  contentData,
  isMobile = false,
}) => {
  const { t } = useAppTranslation();

  const languageDisplayMap: Record<string, string> = {
    english: 'English',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    bengali: 'বাংলা',
    assamese: 'অসমীয়া',
    kannada: 'ಕನ್ನಡ',
    tamil: 'தமிழ்',
    malayalam: 'മലയാളം',
  };

  const getLanguageDisplay = () => {
    const language = contentData?.language?.[0];
    if (!language) return null;

    const displayName =
      languageDisplayMap[language.toLowerCase?.() ?? ''] ?? language;

    return (
      <Typography
        sx={{
          display: 'inline-block',
          backgroundColor: isMobile ? '#FFBD0D' : '#FCD905',
          padding: '2px 8px',
          color: '#000000',
          fontSize: isMobile ? '1rem' : '16px',
          fontWeight: isMobile ? 600 : 500,
          fontFamily: 'Poppins',
        }}
      >
        {displayName}
      </Typography>
    );
  };

  if (isMobile) {
    return (
      <Stack spacing={0.5}>
        <Typography
          sx={{
            mt: 0,
            textAlign: 'left',
            fontWeight: 400,
            fontFamily: 'Poppins',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#000000',
          }}
        >
          <b>{t('AUTHOR')}:</b> {contentData?.author || ''}
        </Typography>

        <Typography
          sx={{
            mt: 0,
            textAlign: 'left',
            fontWeight: 400,
            fontFamily: 'Poppins',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#000000',
          }}
        >
          <b>{t('PUBLISHER')}:</b> {contentData?.publisher ?? ''}
        </Typography>

        <Typography
          sx={{
            mt: 0,
            textAlign: 'left',
            fontWeight: 400,
            fontFamily: 'Poppins',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#000000',
          }}
        >
          {contentData?.year ?? 'n.d.'}
        </Typography>

        {getLanguageDisplay()}
      </Stack>
    );
  }

  return (
    <Stack spacing={0.5}>
      <Typography
        textAlign="left"
        sx={{
          color: '#000000',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: 'Poppins',
        }}
      >
        <span
          style={{
            color: '#000000',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Poppins',
          }}
        >
          {t('AUTHOR')} :
        </span>{' '}
        {contentData?.author ?? ''}
      </Typography>

      <Typography
        textAlign="left"
        sx={{
          color: '#000000',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: 'Poppins',
        }}
      >
        <span
          style={{
            color: '#000000',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Poppins',
          }}
        >
          {t('PUBLISHER')} :
        </span>{' '}
        {contentData?.publisher ?? ''}
      </Typography>

      <Typography
        textAlign="left"
        sx={{
          color: '#000000',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: 'Poppins',
        }}
      >
        {contentData?.year ?? 'n.d.'}
      </Typography>

      <Typography
        textAlign="left"
        sx={{
          color: '#000000',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: 'Poppins',
        }}
      >
        {getLanguageDisplay()}
      </Typography>
    </Stack>
  );
};
