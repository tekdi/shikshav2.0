import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function FooterText() {
  return (
    <Grid
      sx={{
        px: 4,
        py: 1,
        background: 'linear-gradient(90deg, #FFD500 0%, #EDA145 100%)',
      }}
    >
      <Typography
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: '10px', md: '14px' } }}
      >
        Curated by ATREE: For, Of, and By Environment Educators of India
      </Typography>
    </Grid>
  );
}
