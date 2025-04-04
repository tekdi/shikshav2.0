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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const handleClick = () => {
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
                fontSize: { xs: '18px', md: '30px' },
                fontWeight: 500,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Typography
            sx={{
              width: '245px',
              color: 'white',
              fontWeight: 700,
              // width: isMobile ? 'auto' : '70%',
              fontSize: { xs: '18px', md: '30px' },
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
