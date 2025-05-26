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
}: {
  image: string;
  name: string;
  _image?: object;
  _text?: object;
  _textPosition?: object;
  _showAvatar?: boolean;
  _eventClick?: boolean;
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
            padding: 5,
            background:
              'linear-gradient(180deg, rgba(102, 102, 102, 0) 0%, #000000 100%)',
            ..._text,
            ..._textPosition,
          }}
        >
          {_showAvatar && (
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
          )}
          <Typography
            sx={{
              width: '245px',
              color: 'white',
              fontWeight: 800,
              fontFamily: 'Poppins',
              fontSize: { xs: '18px', md: '24px' },
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
