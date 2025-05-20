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
  const languageDisplayMap: Record<string, string> = {
    english: 'ENG',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    bengali: 'বাংলা',
    assamese: 'অসমীয়া',
    kannada: 'ಕನ್ನಡ',
    tamil: 'தமிழ்',
    malayalam: 'മലയാളം',
  };
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
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
              key={content.identifier}
              {..._grid}
            >
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0px 4px 4px 0px #00000040',
                  background: 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}
                onClick={() => handleCardClick(content)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '66.66%', // 3:2 aspect ratio (2/3 = 0.6666)
                    overflow: 'hidden',
                    borderRadius: '16px 16px 0 0',
                    border: '1px solid rgba(0,0,0,0.1)',
                    mb: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={content?.posterImage || _card?.image}
                    alt={content.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // Changed from 'cover' to 'contain'
                      backgroundColor: '#f5f5f5', // Fallback background
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 0 10px 0 !important',
                    marginLeft: '6px',
                    flexGrow: 1,
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
                      fontFamily: 'Manrope, sans-serif',
                    }}
                  >
                    {content.name}
                  </Typography>

                  {/* Year and Language Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '4px',
                    }}
                  >
                    {/* Year */}
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#171D1E',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      {`${
                        (content as any)?.year?.toLowerCase?.() === 'n.d.' ||
                        !(content as any)?.year
                          ? 'N/A'
                          : (content as any)?.year
                      }`}
                    </Typography>

                    {/* Native Language Tag */}
                    {content?.language?.[0] && (
                      <Box
                        sx={{
                          backgroundColor: '#FCD905', // highlighted yellow
                          padding: '2px 8px',
                          // borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '12px',
                          color: '#000',
                        }}
                      >
                        {languageDisplayMap[
                          content.language[0].toLowerCase?.() ?? ''
                        ] ?? content.language[0]}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {isHome && visibleCount < contents.length && (
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              mt={3}
              sx={{
                mb: { xs: 2, sm: 0 },
              }}
            >
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
