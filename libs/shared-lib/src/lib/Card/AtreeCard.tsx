import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ContentSearchResponse } from '../Services/Content/Search';
import { usePathname } from 'next/navigation';
const ITEMS_PER_PAGE = 20;

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
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const pathname = usePathname();
  const isHome = pathname.includes('/home');
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleContents = contents?.slice(0, visibleCount);
  return (
    <Grid container spacing={2} width="100%">
      {contents?.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            width: '100%',
            fontWeight: 500,
            color: 'text.secondary',
            mt: 2,
          }}
        >
          No resources found
        </Typography>
      ) : (
        <>
          {(isHome ? visibleContents : contents).map((content) => (
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
                  image={content?.posterImage || _card?.image}
                  alt={content.name}
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    aspectRatio: '176 / 118',
                    overflow: 'hidden',
                    mb: 2,
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

          {isHome && visibleCount < contents.length && (
            <Box width="100%" display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                sx={{ background: '#FFBD0D', color: '#2B3133' }}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Grid>
  );
});
