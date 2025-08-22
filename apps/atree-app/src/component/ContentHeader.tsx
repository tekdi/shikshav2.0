import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import { useRouter } from 'next/router';
import { useAppTranslation } from '../utils/i18n.helper';

interface ContentHeaderProps {
  homeCategory: string;
  subFrameworkFilter: any[];
  hasToken: boolean;
  isBookmarked: boolean;
  isBookmarkLoading: boolean;
  onBookmarkToggle: () => void;
  onShareClick: () => void;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  homeCategory,
  subFrameworkFilter,
  hasToken,
  isBookmarked,
  isBookmarkLoading,
  onBookmarkToggle,
  onShareClick,
}) => {
  const router = useRouter();
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/home?category=${homeCategory}`);
          }}
          sx={{
            padding: '4px',
            backgroundColor: 'transparent',
            color: '#000000',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        {subFrameworkFilter && subFrameworkFilter.length > 0 && (
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: { xs: '16px', md: '18px' },
              lineHeight: '28px',
              color: '#000000',
            }}
          >
            {t('BROWSE_BY_SUB_CATEGORIES')}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '4px',
          borderRadius: '8px',
          marginLeft: 'auto',
          marginRight: '15px',
        }}
      >
        <IconButton
          color="primary"
          disabled={isBookmarkLoading}
          sx={{
            backgroundColor: 'white',
            color: hasToken && isBookmarked ? '#FCD905' : '#2B3133',
            opacity: isBookmarkLoading ? 0.6 : 1,
          }}
          onClick={onBookmarkToggle}
        >
          {hasToken && isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>

        <IconButton
          onClick={onShareClick}
          color="primary"
          sx={{
            backgroundColor: 'white',
            color: '#2B3133',
          }}
        >
          <ShareIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
