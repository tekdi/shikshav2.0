import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';

const contentConfig = [
  { type: 'PDF', identifier: 'do_214210695162388480112' },
  { type: 'QUML', identifier: 'do_21421049808039936017' },
  { type: 'VIDEO', identifier: 'do_214210683521646592110' },
  { type: 'EPUB', identifier: 'do_21421049808039936017' },
];

const Index = () => {
  const router = useRouter();

  const handleNavigation = (identifier: string) => {
    router.push({
      pathname: '/play',
      query: { identifier },
    });
  };

  return (
    <Box p={2}>
      <Box mb={2}>
        <Typography variant="h5">Sunbird Player's Micro-frontend</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {contentConfig.map((content) => (
          <Button
            key={content.type}
            sx={{
              border: '1px solid',
              borderColor: 'blue.400',
            }}
            onClick={() => handleNavigation(content.identifier)}
          >
            {content.type}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Index;
