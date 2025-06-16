import * as React from 'react';
// import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Box, Typography, useMediaQuery, useTheme, Grid } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { commonStyles } from '../utils/commonStyle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import landingBanner2 from '../../assets/images/png/2.png';
import atreelogo from '../../assets/images/ATREE.png';
import Image from 'next/image';

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
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '22px', md: '57px' },
            fontFamily: 'Poppins',
            color: '#000000',
            marginTop: '10px',
            marginBottom: { xs: '10px', md: '47px' },
          }}
        ></Typography>
        <br></br>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: 900,
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
          }}
        >
          <b>SNAIL: Slow. Intentional. Transformative</b>
        </Typography>

        {/* About Us Description */}
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
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
        <br></br>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
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
        <br></br>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
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
        <br></br>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
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
        <br></br>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
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
        <br></br>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Leadership Support:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
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
        <br></br>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Team:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          Pallavi Varma Patil: Lead, Environment Education, ATREE Academy
          <br></br>
          Rushad Irani : Research Associate, ATREE Academy
        </Typography>
        <br></br>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>Acknowledgments:</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          We sincerely thank the following for their generous support in terms
          of time, resources, and commitment:
          <br></br>
          <br></br>
          <Typography
            component="div"
            sx={{ fontSize: { xs: '14px', md: '16px' } }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '18px', md: '18px' }, // Now using sx prop correctly
              }}
            >
              Funding Support:
            </Typography>{' '}
            <Typography component="span">Rainmatter Foundation</Typography>
          </Typography>
          <br></br>
          <Typography
            component="div"
            sx={{ fontSize: { xs: '14px', md: '16px' } }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '18px', md: '18px' }, // Now using sx prop correctly
              }}
            >
              Technical Support:
            </Typography>{' '}
            <Typography component="span">
              Vijay Rasquinha, Teerath Rawat, ATREE for their valuable technical
              and design expertise. TEKDI Technologies for their execution of
              the project
            </Typography>
          </Typography>
          <br></br>
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '18px', md: '18px' }, // Now using sx prop correctly
            }}
          >
            Content Support:
          </Typography>{' '}
          <Typography component="span">
            Public and Private school teachers who actively participated in the
            ‘Jal-Jungle-Jameen in classrooms’ workshops; partner NGOs; middle
            school students; volunteers, and part-time consultants (Madhushri,
            Ankit, Vaishnavi, Angela) of the project.
          </Typography>
        </Typography>

        <Box
          sx={{
            width: '100%',
            boxSizing: 'border-box',
            px: { xs: 2, md: 10 },
            mt: 4,
            // paddingRight: { xs: 0, md: '20%' },
            // paddingLeft: { xs: 0, md: '20%' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              px: { xs: 2, md: 4 },
              py: { xs: 3, md: 4 },
            }}
          >
            <Grid
              container
              spacing={4}
              direction={isMobile ? 'column' : 'row'}
              alignItems="center"
              justifyContent="center"
            >
              {/* Logo Section */}
              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '120px', md: '200px' },
                    height: { xs: '120px', md: '200px' },
                    position: 'relative',
                  }}
                >
                  <Image
                    src={atreelogo}
                    alt="Organization Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              </Grid>

              {/* Contact Info Section */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // gap: 1,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '14px', md: '16px' },
                      fontFamily: 'Poppins',
                      color: '#000',
                    }}
                  >
                    <b>Contact Us:</b>
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: '14px', md: '16px' },
                      fontFamily: 'Poppins',
                      color: '#000',
                    }}
                  >
                    Ashoka Trust for Research in Ecology and the Environment
                    (ATREE), Royal Enclave, Srirampura, Jakkur, Bengaluru,
                    Karnataka 560064.
                  </Typography>

                  <Typography sx={{ fontFamily: 'Poppins' }}>
                    +91-80-23635555
                  </Typography>
                  <Typography sx={{ fontFamily: 'Poppins' }}>
                    envedu@atree.org | www.atree.org
                  </Typography>
                </Box>
              </Grid>

              {/* Map Section */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', md: '100%' },
                    height: { xs: '250px', md: '300px' },
                    overflow: 'hidden',
                    px: { xs: 0, md: 2 },
                  }}
                >
                  <iframe
                    title="Google Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '8px' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Royal+Enclave,+Srirampura,+Jakkur,+Bengaluru,+Karnataka+560064&output=embed"
                  ></iframe>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <FooterText page="" />
    </Layout>
  );
}
