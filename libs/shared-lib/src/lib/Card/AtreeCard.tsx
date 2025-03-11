import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ContentSearchResponse } from '../Services/Content/Search';
// import atreeLogo from '../../assets/images/atreeLogo.png';

export const AtreeCard: React.FC<{
  contents: ContentSearchResponse[];
  _grid: object;
  handleCardClick: (content: ContentSearchResponse) => void;
  _card?: any;
}> = React.memo(function AtreeCard({
  contents,
  handleCardClick,
  _grid,
  _card,
}) {
  return (
    <Grid container spacing={2} width="100%">
      {contents.map((content) => (
        <Grid
          size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 4 }}
          sx={{
            cursor: 'pointer',
          }}
          key={content.identifier}
          {..._grid}
        >
          <Card
            sx={{
              height: '100%',
              boxShadow: 'none',
              background: 'transparent',
            }}
            onClick={() => handleCardClick(content)}
          >
            <CardMedia
              component="img"
              image={(content as any)?.image || _card?.image}
              alt={content.name}
              sx={{
                objectFit: 'contain',
                objectPosition: 'center',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.1)',
                aspectRatio: '176 / 118',
                overflow: 'hidden',
                mb: 2,
                '& > img': {
                  width: '100%',
                  height: '100%',
                  background: 'white',
                },
              }}
            />
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 0 10px 0 !important',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#171D1E',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {content.name}
              </Typography>
              <Typography color="text.secondary">
                {`Year: ${(content as any)?.year || 'N/A'}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
});
