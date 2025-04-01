import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function FooterText() {
  return (
    <Grid sx={{ px: 4, py: 1, backgroundColor: 'secondary.main' }}>
      <Typography align="center" gutterBottom sx={{ fontSize: '10px' }}>
        Curated by ATREE: For, Of, and By Environment Educators of India
      </Typography>
    </Grid>
  );
}
