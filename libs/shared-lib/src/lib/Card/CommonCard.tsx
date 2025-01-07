import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

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
      sx={{ height: minheight, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {image && orientation === 'horizontal' && (
        <CardMedia
          component="img"
          height="194"
          image={image}
          alt={imageAlt || ''}
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
        title={title}
        subheader={subheader || ''}
      />
      {content && (
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {content}
          </Typography>
        </CardContent>
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && <CardActions disableSpacing>{actions}</CardActions>}
    </Card>
  );
};
