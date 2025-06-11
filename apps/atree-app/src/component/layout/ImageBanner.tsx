'use client';
import { useRouter } from 'next/router';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';
import { trackEvent } from '@shared-lib';

export const ImageBanner = ({
  image,
  name,
  _image,
  _text,
  _textPosition = { bottom: 0, left: 0, right: 0 },
  _showAvatar = false,
  _eventClick = false,
  verticalText,
  _verticalTextPosition = 'left',
}: {
  image: string;
  name: string;
  _image?: object;
  _text?: object;
  _textPosition?: object;
  _showAvatar?: boolean;
  _eventClick?: boolean;
  verticalText?: string;
  _verticalTextPosition?: 'left' | 'right';
}) => {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    trackEvent({
      action: 'landing_page_click',
      category: 'engagement',
      label: `Category - ${encodeURIComponent(name)}`,
    });
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `Category - ${encodeURIComponent(name)}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: 'landing_page',
      },
    };
    telemetryFactory.interact(telemetryInteract);
    router.push(`/home?category=${encodeURIComponent(name)}`);
  };

  return (
    <Card
      sx={{ width: '100%', position: 'relative' }}
      onClick={_eventClick ? undefined : handleClick}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt={name}
          sx={{ objectFit: 'cover', ..._image }}
          image={image}
        />

        {/* Vertical text (Desktop) */}
        {verticalText && (
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              top: 0,
              bottom: 0,
              [_verticalTextPosition]: 0,
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 800,
                fontFamily: 'Poppins',
                fontSize: '11px',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {verticalText}
            </Typography>
          </Box>
        )}

        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            padding: {
              xs: 2,
              sm: 5,
            },
            ..._text,
            ..._textPosition,
          }}
        >
          <Typography
            sx={{
              width: '100%',
              textAlign: 'center',
              color: 'white',
              fontWeight: 800,
              fontFamily: 'Poppins',
              fontSize: { xs: '16px', md: '34px' },
              textTransform: 'capitalize',
            }}
          >
            {name?.toUpperCase()}
          </Typography>
        </CardContent>

        {/* Horizontal text at bottom edge (Mobile only) */}
        {verticalText && (
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
               justifyContent: 'center',
              // backgroundColor: 'rgba(0,0,0,0.6)', // Optional for readability
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontFamily: 'Poppins',
                fontSize: '5px',
                textTransform: 'uppercase',
              }}
            >
              {verticalText}
            </Typography>
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
};
