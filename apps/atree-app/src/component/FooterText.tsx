import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
type FooterTextProps = {
  readonly page?: string; // made optional in case it's not always passed
};
export default function FooterText({ page }: FooterTextProps) {
  const isAboutPage = page === 'aboutus';

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
        {isAboutPage ? (
          <>
            Ashoka Trust for Research in Ecology and the Environment (ATREE),
            <br />
            Royal Enclave, Sriramapura, Jakkur Post, Bangalore 560 064 Karnataka
          </>
        ) : (
          'Curated by ATREE: For, Of, and By Environment Educators of India'
        )}
      </Typography>
    </Grid>
  );
}
