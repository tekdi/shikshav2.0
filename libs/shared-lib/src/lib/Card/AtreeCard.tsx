import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ContentSearchResponse } from '../Services/Content/Search';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
  const loaderRef = useRef<HTMLDivElement>(null);
  const maxChars = 20;

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
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [contents]);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && contents && visibleCount < contents.length) {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      }
    },
    [contents, visibleCount]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  const visibleContents = isHome ? contents?.slice(0, visibleCount) : contents;

  return (
    <Grid
      container
      spacing={2}
      width="100%"
      sx={{ paddingBottom: _card?.paddingBottom || '0px' }}
    >
      {/* Display a message if contents is empty */}
      {contents?.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            width: '100%',
            fontWeight: 500,
            mt: 2,
          }}
        >
          Oops! We don't have this resource yet on our shelves. Help us stock it
          by recommending it{' '}
          <Link
            href="https://docs.google.com/forms/d/1r4wxm2a2kKH2Veq9_AYIfmWNYJJh5u-nw_SweHC5ydQ/viewform?edit_requested=true"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0037B9', textDecoration: 'underline' }}
          >
            here
          </Link>
        </Typography>
      ) : (
        <>
          {visibleContents?.map((content) => (
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
                      objectFit: 'cover',
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
                      fontWeight: 500,
                      fontSize: { xs: '14px', md: '16px' },
                      lineHeight: '20px',
                      color: '#000000',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {content?.name}
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
                        fontWeight: 400,
                        fontSize: { xs: '14px', md: '16px' },
                        lineHeight: '20px',
                        color: '#000000',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {(content as any)?.year || 'n.d.'}
                    </Typography>

                    {/* Native Language Tag */}
                    {content?.language?.[0] && (
                      <Box
                        sx={{
                          backgroundColor: '#FCD905',
                          padding: '2px 8px',
                          fontWeight: 400,
                          fontSize: { xs: '14px', md: '16px' },
                          color: '#000000',
                          fontFamily: 'Poppins',
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

          {/* Infinite scroll loader */}
          {isHome && visibleCount < (contents?.length || 0) && (
            <div ref={loaderRef} style={{ width: '100%', height: '20px' }} />
          )}
        </>
      )}
    </Grid>
  );
});
