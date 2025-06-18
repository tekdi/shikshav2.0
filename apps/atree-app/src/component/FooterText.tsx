import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
type FooterTextProps = {
  readonly page?: string; // made optional in case it's not always passed
};
export default function FooterText({ page }: FooterTextProps) {
  return (
    <Grid
      sx={{
        px: 4,
        py: 1,
        background: '#fcd804',
      }}
    >
      <Typography
        align="center"
        gutterBottom
        fontFamily="poppins"
        sx={{ fontSize: { xs: '8px', md: '14px', fontWeight: 400 } }}
      >
        Curated by Ashoka Trust for Research in Ecology and the Environment
        <a
          style={{
            marginLeft: 8,
            color: 'blue',
            textDecoration: 'underline',
          }}
          href="https://www.atree.org"
          target="_blank"
          rel="noopener noreferrer"
        >
         (ATREE)
        </a>
         : For, Of, and By Environment Educators of India
      </Typography>
    </Grid>
  );
}
