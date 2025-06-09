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
        {verticalText && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              [_verticalTextPosition]: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px', // Adjust as needed
              // backgroundColor: 'rgba(0,0,0,0.5)', // Optional background
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 800,
                fontFamily: 'Poppins',
                fontSize: { xs: '2vw', md: '11px' },
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                height: { xs: '90%', md: '90%' },
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
            justifyContent: 'flex-end',
            gap: 1,
            padding: {
              xs: 2,
              sm: 5,
            },
            ..._text,
            ..._textPosition,
          }}
        >
          {/* {_showAvatar && (
            <Avatar
              sx={{
                bgcolor: '#CEE5FF',
                color: '#000',
                width: { xs: 40, md: 85 },
                height: { xs: 40, md: 85 },
                fontFamily: 'Poppins',
                fontSize: { xs: '18px', md: '45px' },
                fontWeight: 800,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          )} */}
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
      </CardActionArea>
    </Card>
  );
};
