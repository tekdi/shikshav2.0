import * as React from 'react';
import AspectRatio from '@mui/material/AspectRatio';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface CarouselItem {
  src: string;
  title: string;
  description: string;
}

interface CarouselProps {
  data: CarouselItem[];
  cardWidth?: number; // Width of each card in the carousel
  onCardClick?: (item: CarouselItem) => void; // Callback for when a card is clicked
}

const CommonCarousel: React.FC<CarouselProps> = ({
  data,
  cardWidth = 150,
  onCardClick,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        py: 1,
        overflow: 'auto',
        width: '100%',
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
        },
        '::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {data.map((item) => (
        <Card
          orientation="horizontal"
          size="sm"
          key={item.title}
          variant="outlined"
          sx={{
            cursor: onCardClick ? 'pointer' : 'default',
          }}
          onClick={() => onCardClick?.(item)}
        >
          <AspectRatio ratio="1" sx={{ minWidth: cardWidth }}>
            <img
              srcSet={`${item.src}?h=120&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.src}?h=120&fit=crop&auto=format`}
              alt={item.title}
            />
          </AspectRatio>
          <Box sx={{ whiteSpace: 'nowrap', mx: 1 }}>
            <Typography level="title-md">{item.title}</Typography>
            <Typography level="body-sm">{item.description}</Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default CommonCarousel;
