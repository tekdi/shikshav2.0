import React from 'react';
import { Box, Button } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { useAppTranslation } from '../utils/i18n.helper';

interface ContentActionsProps {
  contentData: any;
  onPreview: () => void;
  onDownload: () => void;
  onResourceLink: () => void;
  isMobile?: boolean;
}

export const ContentActions: React.FC<ContentActionsProps> = ({
  contentData,
  onPreview,
  onDownload,
  onResourceLink,
  isMobile = false,
}) => {
  const { t } = useAppTranslation();

  const isPreviewDisabled =
    contentData?.access?.trim() === 'Full' ||
    contentData?.access?.trim() === 'Link';

  const isDownloadDisabled =
    contentData?.access?.trim() === 'Sample' ||
    contentData?.access?.trim() === 'Link';

  const isResourceLinkDisabled =
    (contentData?.access?.trim() === 'Sample' ||
      contentData?.access?.trim() === 'Full') &&
    !contentData?.url;

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          width: '100%',
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          disabled={isPreviewDisabled}
          sx={{
            borderRadius: '50px',
            height: '36px',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'none',
            px: 1,
            minWidth: '95px',
            gap: '5px',
          }}
          startIcon={<VisibilityOutlinedIcon sx={{ fontSize: '14px' }} />}
          onClick={onPreview}
        >
          {t('PREVIEW')}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: '50px',
            height: '36px',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'none',
            px: 1,
            minWidth: '95px',
            gap: '5px',
            color: 'black',
          }}
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: '14px' }} />}
          onClick={onDownload}
          disabled={isDownloadDisabled}
        >
          {t('DOWNLOAD')}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: '50px',
            height: '36px',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'none',
            px: 1,
            minWidth: '95px',
            gap: '5px',
            color: 'black',
          }}
          startIcon={<LinkOutlinedIcon sx={{ fontSize: '14px' }} />}
          disabled={isResourceLinkDisabled}
          onClick={onResourceLink}
        >
          {t('RESOURCE_LINK')}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        width: '100%',
        '& > button': {
          flex: 1,
          minWidth: 0,
          maxWidth: 152,
          textTransform: 'none',
          '& .MuiButton-startIcon': {
            marginRight: '4px',
          },
        },
      }}
    >
      <Button
        variant="contained"
        sx={{
          borderRadius: '50px',
          height: '40px',
          padding: '3px',
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'Poppins',
          color: '#000000',
          backgroundColor: '#fcd804',
        }}
        onClick={onPreview}
        disabled={isPreviewDisabled}
        startIcon={<VisibilityOutlinedIcon />}
      >
        {t('PREVIEW')}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        sx={{
          borderRadius: '50px',
          height: '40px',
          color: '#000000',
          padding: '3px',
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'Poppins',
        }}
        startIcon={<FileDownloadOutlinedIcon />}
        disabled={isDownloadDisabled}
        onClick={onDownload}
      >
        {t('DOWNLOAD')}
      </Button>

      <Button
        variant="outlined"
        sx={{
          borderRadius: '50px',
          height: '40px',
          color: '#000000',
          padding: '3px',
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'Poppins',
          borderColor: '#fcd804',
        }}
        startIcon={<LinkOutlinedIcon />}
        disabled={isResourceLinkDisabled}
        onClick={onResourceLink}
      >
        {t('RESOURCE_LINK')}
      </Button>
    </Box>
  );
};
