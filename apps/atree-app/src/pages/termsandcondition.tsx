import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import { commonStyles } from '../utils/commonStyle';
import landingBanner4 from '../../assets/images/png/4.png';

export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Layout
      isFooter={isMobile} // add this when on mobile
    >
      <Banner singleImage={landingBanner4.src} />
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
          Welcome to the The SNAIL NETWORK digital repository platform (herein
          after referred to as “Platform”). Please read the following terms and
          conditions carefully before accessing, using, or obtaining any
          materials, information, or services. The Platform includes the SaaS
          application accessible through a website and a mobile application. By
          accessing any component of the Platform you agree to be bound by these
          terms and conditions. We may change, add, or remove portions of these
          terms and conditions at any time, which shall become effective
          immediately upon posting. If these terms are amended in such a way
          that substantially alters the privacy or security, users will be
          notified upon their first return to the platform.
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
          Please contact our team at envedu@atree.org if you have any questions,
          concerns, or comments.
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          1. Login Requirements
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
          Access to the environment education resources (either sample or full)
          on the Platform is free but repeat users require a registered login.
          Curated information on the resources can be accessed through the
          website or mobile application
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          2. Termination
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
          The Platform may, in its sole discretion, terminate or suspend access
          to the reader /user community for any reason, including, without
          limitation, breach, or assignment of these terms.
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          3. Content & Intellectual Property
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
          All Content curated by ATREE is provided ‘as is’ on this Platform. The
          Platform does not make any warranty, express, implied or otherwise,
          regarding its accuracy, completeness or performance.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>3.1 Copyright:</b>&nbsp; The Platform strives to be an open and
          freely accessible digital library of environment education resources
          in multiple Indian languages and in multiple formats contextual to
          India. The aim is that the resources are used by as large of an
          audience as possible. However, we endeavor to protect the intellectual
          property rights of the creators and publishers of the content.
          <span>
            We offer a short preview where the content is not open access. And
            full access to resources where publishers have provided us with
            written consent or content is kept under Creative Commons or
            equivalent license. For almost all our resources we have endeavoured
            to provide a source link from where one can procure a resource or
            know more about it. If as a publisher or content creator, you feel
            that we have violated any copyright issues while highlighting a
            resource, we request you to immediately bring it to our notice for
            amendment.
          </span>
          <span>
            As a user of the Platform, you agree to abide by all copyright
            notices, trademark rules, and any other restrictions set forth.
          </span>
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <span style={{ fontWeight: 800 }}>3.2 User Community: </span>While we
          strive to enforce these terms and conditions that will allow for an
          open, productive, safe and inviting space for diverse users to access,
          share, recommend, and otherwise enjoy the curated resources on offer,
          we do not and cannot guarantee that users of the Platform will
          conform, fully abide by, and use the platform in compliance with these
          terms. We reserve the right to remove any inappropriate language or
          behaviour that violates community guidelines.
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          4. Privacy Policy
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
          Your privacy is very important to us. Please completely read and
          understand the following privacy policy before using the Platform.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>4.1 Data Collection and Storage:</b>&nbsp; By using the Platform,
          you consent to The SNAIL NETWORK for collecting and using certain
          types of data, such as IP address, browser type, pages visited, visit
          times, resources viewed, and other usage information. This data helps
          enhance the repository and improve the experience for the user. Usage
          data is anonymized for storage and analysis to understand user
          preferences and measure platform growth over time.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>4.2 Cookies:</b>&nbsp; Cookies are small text files that the
          Platform can send to your browser for storage on your computer's hard
          drive. They make your use of the Platform easier by saving your status
          and preferences and may be refreshed every time you visit. The
          Platform may use session cookies when you visit our website/app while
          your browser is open, or while you are logged into the Platform. To
          facilitate the registration and login functions, cookies may be used
          to recognize when you return to the Platform. If others will be using
          your computer or you are using a public computer such as in an
          Internet Café, school, or library, you should log out of your account
          so that your logon information is cleared. Most browser are initially
          set to accept cookies, but you may be able to change the settings to
          refuse cookies or to be alerted when cookies are being sent.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>4.3 Children's Privacy:</b>&nbsp; The platform does not collect
          personal information, regardless of age but it highly encourages
          parents and legal guardians to review the privacy policies of the
          companies that provide log-in services to the Platform.
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          5. Other Websites
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
          Material on the Platform may link to independently run websites
          outside of the SNAIL Network domain. The platform is not responsible
          for the privacy practices or content of such websites. We encourage
          you to read the privacy policies of any websites you visit from this
          website.
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          6. Disclosure to Third Parties
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
          No reader data is sold or traded to third parties.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>6.1 General Readers:</b>&nbsp; At times, the platform may make
          information available for research, impact reports, or to strategic
          partners for analysis. If this occurs, any data shared is anonymous,
          aggregated form that cannot be directly connected to individual users.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',

            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>6.2 Logged-in Readers Community:</b>&nbsp; CBy using Google login
          when creating a platform profile, readers' data is subject to the
          terms and privacy policies of the third parties.
        </Typography>

        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          7. Your Rights
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
          To request details of the information we hold about you or if you have
          provided us with your personal information, but decide at a later date
          that you no longer want to receive information from us, or if you wish
          to update us that your contact details have changed or change your
          preferences, please let us know.
        </Typography>
      </Grid>

      {<FooterText page="" />}
    </Layout>
  );
}
