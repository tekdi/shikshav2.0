'use client';
import { useRouter } from 'next/router';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
export const ImageBanner = ({
  image,
  name,
  _image,
  _text,
}: {
  image: string;
  name: string;
  _image?: object;
  _text?: object;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/home?category=${encodeURIComponent(name)}`);
  };
  return (
    <Card sx={{ width: '100%' }} onClick={handleClick}>
      <CardActionArea>
        <CardMedia component="img" alt={name} sx={_image} image={image} />
        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5) , rgba(0, 0, 0, 0))',
            zIndex: 1,
            ..._text,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'white',
              zIndex: 2,
              mb: 0,
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '24px',
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
