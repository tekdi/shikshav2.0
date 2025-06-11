import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { commonStyles } from '../utils/commonStyle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import landingBanner2 from '../../assets/images/png/2.png';

export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Layout
      isFooter={isMobile} // add this when on mobile
    >
      <Banner singleImage={landingBanner2.src} />
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        marginBottom={'25px'}
        sx={commonStyles.responsivePadding}
      >
        {/* About Us Title */}
        <Typography
          sx={{
            textAlign: 'center',
            lineHeight: { xs: '30px', md: '64px' },
            fontWeight: { xs: 600, md: 600 },
            fontSize: { xs: '22px', md: '57px' },
            fontFamily: 'Poppins',
            color: '#000000',
            marginTop: { xs: '20px', md: '47px' },
            marginBottom: { xs: '10px', md: '47px' },
          }}
        >
          About Us
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 500, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
          }}
        >
          <b>SNAIL: Slow. Intentional. Transformative</b>
        </Typography>
        {/* About Us Description */}
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontSize: { xs: '14px', md: '16px' },
            fontFamily: 'Poppins',
            color: '#000000',
            fontWeight: 400,
          }}
        >
          S.N.A.I.L stands for the School of Nature, Action, Inquiry, and
          Learning; wherein we reclaim the original meaning of the word ‘school’
          -- a place of discussion and learning. SNAIL is an initiative of
          Ashoka Trust for Research in Ecology and the Environment (ATREE)
          Academy, Bengaluru, India.
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          Its vision is to enrich Place Based Environment Education (PBEE) at
          school level in India by offering curriculum and pedagogy related
          inputs. Towards this vision, it offers training, workshops, resources,
          and a growing network of environmental education organisations in
          India that inspire children with knowledge, hope, and action to care
          for their local natural resources.
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          The digital repository contains multilingual, multi-format teaching-
          learning resources that are contextual to India’s biodiversity. These,
          peer-reviewed, annotated resources support STEAM (Science, Technology,
          Engineering, Arts, and Maths) education that promotes
          interdisciplinary learning, while encouraging students to apply what
          they learn to help solve complex environmental issues locally.
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          We encourage you to explore our curated collection of engaging and
          relevant environment education resources. Browse through picture
          books, activity books, worksheets, teachers’ manuals, textbook
          chapters, classroom posters, board games, comic books, graphic novels,
          magazines, websites, field guides, stories, songs, films and more.
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          This growing repository welcomes contributions from all dedicated to
          promoting environment education content at middle and high school
          level in India. It currently features resources sourced from over 70
          state and non-state actors across India. We welcome your suggestions
          to help us continue improving and expanding this collection!
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Leadership Support:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          Anita Arjundas for her vision, guidance, and administrative support
          <br></br>
          Dr. Kamal Bawa for his encouraging mentorship
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Team:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          Pallavi Varma Patil: Lead, Environment Education, ATREE Academy Rushad
          <br></br>
          Irani : Research Associate, ATREE Academy
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Acknowledgments:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          We sincerely thank the following for their generous support in terms
          of time, resources, and commitment:
          <br></br>
          <b>Technical Support:</b> Vijay Rasquinha, Teerath Rawat, ATREE for
          their valuable technical and design expertise. TEKDI Technologies for
          their execution of the project
          <br></br>
          <b>Content Support:</b> Public and Private school teachers who
          actively participated in the ‘Jal-Jungle-Jameen in classrooms’
          workshops;, partner NGOs; middle school students; volunteers, and
          part-time consultants (Madhushri, Ankit, Vaishnavi, Angela) of the
          project
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Contact us:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            mb: 1,
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          Please feel free to reach out to us with suggestions, comments and
          feedback!
        </Typography>
        <Box sx={{ pl: { xs: 2, md: 10 }, pr: { xs: 2, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AlternateEmailIcon
              sx={{ mr: 1, fontSize: { xs: '14px', md: '16px' } }}
            />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
              }}
            >
              envedu@atree.org
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnOutlinedIcon
              sx={{ mr: 1, fontSize: { xs: '14px', md: '16px' } }}
            />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
              }}
            >
              Ashoka Trust for Research in Ecology and the Environment (ATREE),
              Royal Enclave, Srirampura, Jakkur, Bengaluru, Karnataka 560064.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CallOutlinedIcon
              sx={{
                mr: 1,
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: { xs: '14px', md: '16px' },
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
              }}
            >
              Phone: +91-80-23635555
            </Typography>
          </Box>
        </Box>
      </Grid>
      <FooterText page="" />
    </Layout>
  );
}
