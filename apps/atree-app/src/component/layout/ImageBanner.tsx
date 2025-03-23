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
}: {
  image: string;
  name: string;
  _image?: object;
  _text?: object;
  _textPosition?: object;
  _showAvatar?: boolean;
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const handleClick = () => {
    router.push(`/home?category=${encodeURIComponent(name)}`);
  };

  return (
    <Card sx={{ width: '100%', position: 'relative' }} onClick={handleClick}>
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
              'linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))',
            ..._text,
            ..._textPosition,
          }}
        >
          {_showAvatar && (
            <Avatar
              sx={{
                bgcolor: '#CEE5FF',
                color: '#000',
                width: 40,
                height: 40,
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Typography
            sx={{
              color: 'white',
              fontWeight: 700,
              width: isMobile ? 'auto' : '70%',
              fontSize: { xs: '18px', md: '48px' },
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
