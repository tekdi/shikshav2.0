import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box } from '@mui/material';

interface CommonCardProps {
  title: string;
  avatarLetter?: string;
  avatarColor?: string;
  subheader?: string;
  image?: string;
  imageAlt?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  minheight?: string;
  onClick?: () => void;
}

export const CommonCard: React.FC<CommonCardProps> = ({
  avatarLetter,
  avatarColor = red[500],
  title,
  subheader,
  image,
  imageAlt,
  content,
  actions,
  children,
  orientation,
  minheight,
  onClick,
}) => {
  return (
    <Card
      sx={{
        height: minheight,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '12px',
        bgcolor: '#FEF7FF',
      }}
      onClick={onClick}
    >
      {image && orientation === 'horizontal' && (
        <CardMedia
          component="img"
          image={image}
          alt={imageAlt || ''}
          sx={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      )}
      <CardHeader
        avatar={
          avatarLetter && (
            <Avatar sx={{ bgcolor: avatarColor }} aria-label="avatar">
              {avatarLetter}
            </Avatar>
          )
        }
        action={
          orientation === 'vertical' ? (
            <CardMedia component="img" image={image} />
          ) : undefined
        }
        title={
          <Typography
            variant="h6"
            sx={{
              fontSize: '16px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              // height: '70px',
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="h6" sx={{ fontSize: '14px' }}>
            {subheader}
          </Typography>
        }
      />
      {content && (
        <CardContent
          sx={{
            display: 'flex',
            paddingBottom: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
              sx={{
                color: '#49454F',
                fontSize: '14px',
                fontWeight: 700,
                alignContent: 'flex-start',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', // Prevent wrapping
                flex: 1, // Ensure it takes up remaining space
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              Description:
            </Typography>{' '}
            <Typography
              sx={{
                color: '#49454F',
                fontSize: '14px',
                fontWeight: 400,
                alignContent: 'flex-start',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', // Prevent wrapping
              }}
            >
              {content}
            </Typography>
          </Box>
        </CardContent>
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && (
        <CardActions
          disableSpacing
          sx={{
            border: '1px solid #79747E',
            borderRadius: '8px',
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
            margin: '12px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#6750A4',
            }}
          >
            {actions}
          </Typography>
        </CardActions>
      )}
    </Card>
  );
};
