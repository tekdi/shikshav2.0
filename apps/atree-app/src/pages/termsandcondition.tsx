import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import { commonStyles } from '../utils/commonStyle';
import DigitalHubBanner from '../component/DigitalHubBanner';
export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Layout
      isFooter={isMobile} // add this when on mobile
    >
      <Banner />

      <Grid
        container
        direction="column"
        sx={commonStyles.responsivePadding}
        spacing={2}
        // alignItems="left"

        marginBottom={'25px'}
        justifyContent="center"
      >
        {/* About Us Description */}
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: { xs: 500, md: 500 },
            lineHeight: { xs: '30px', md: '64px' },
            fontSize: { xs: '24px', md: '57px' },
            fontFamily: 'Poppins',
            color: '#000000',
            marginTop: { xs: '20px', md: '47px' },
            marginBottom: { xs: '20px', md: '47px' },
          }}
        >
          Terms and Conditions
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontFamily: 'Poppins',
            color: '#000000',
            fontWeight: 400,
          }}
        >
          Welcome to the Jal Jungle Jameen in classrooms digital library
          platform (herein after referred to as “Platform”). Please read the
          following terms and conditions carefully before accessing, using, or
          obtaining any materials, information, or services. The Platform
          includes the website, and mobile application. By accessing any
          component of the Platform you agree to be bound by these terms and
          conditions. We may change, add, or remove portions of these terms and
          conditions at any time, which shall become effective immediately upon
          posting. If these terms are amended in such a way that substantially
          alters the privacy or security, users will be notified upon their
          first return to the platform.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          Please contact our team at envedu@atree.org if you have any questions,
          concerns, or comments.
        </Typography>
        <Typography
          gutterBottom
          sx={{
            textAlign: 'left',
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          1. Open Access and Login Requirements
        </Typography>

        {/* Content */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          1.1 General Readers. Access to the environment education resources
          (either sample or full) on the Platform is free but repeat users
          require registration or login. Curated information on the resources
          can be accessed through the website, or mobile application
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          1.2 Logged-in Readers. Logins are required to personalize the Jal
          Jungle Jameen in classrooms digital library experience through the
          creation of profile(s). Creating profile(s) allows for the following
          to be created, saved, and updated: profile name, reading history,
          bookmarked books, and downloaded books. Logging in also allows for a
          seamless user experience between different devices. To protect your
          privacy, please use a nickname or username when creating a login.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          2. Termination
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          ATREE may, in its sole discretion, terminate or suspend access to the
          reader /user community for any reason, including, without limitation,
          breach, or assignment of these terms.
        </Typography>
        <Typography
          gutterBottom
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          3. Content & Intellectual Property
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          3.1 General Reader and Logged-in Readers. The Platform strives to be
          an open and freely accessible digital library of environment education
          resources in multiple Indian languages and in multiple formats
          contextual to India. The aim is that the resources are enjoyed and
          used by as large of an audience as possible. We also endeavor to
          protect the intellectual property rights of the creators and
          publishers of the content. The contents on the Platform are protected
          by copyright and other intellectual property laws unless waived off by
          the creators or kept under Creative Commons or equivalent license . By
          using the Platform you agree to abide by all copyright notices,
          trademark rules, and any other restrictions set forth.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          3.2 Prohibited Content The Platform is designed to be an open,
          productive, safe, and inviting space for users across cultures,
          nationalities, religions, and backgrounds. While ATREE strives to
          contribute to the creation of open and free societies, we reserve the
          right to remove any material or content from the website at any time
          and for any reason. An example of material that will be removed from
          the Platform includes (but is not limited to) any material that
          directly attacks and denigrates another group of people based on their
          race, religion, ethnicity, or nationality. Resources that promote,
          glorify, or portray violence in a positive light or which normalize
          discrimination of any kind toward marginalized groups ( gender,
          ethnicity, socioeconomic status) or exploitation towards nature or
          environment do not belong on the Platform. Resources that explore
          these topics with sensitivity and with the purpose of discouraging
          violence or discrimination can be appropriate for Jal Jungle Jameen in
          classrooms.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          4. ATREE’s Role
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          6.1 User Community. While we strive to enforce these terms and
          conditions that will allow for an open, productive, safe and inviting
          space for diverse users to access, share, recommend, and otherwise
          enjoy the curated resources on offer, we do not and cannot guarantee
          that users of the Platform will conform, fully abide by, and use the
          website/mobile app in compliance with these terms. We are not required
          to nor shall we endeavor to resolve any dispute or disagreement
          between users or visitors. While we reserve the right to remove any
          material or content from the Platform at any time and for any reason,
          the Platform does contain content generated by users for which ATREE
          has no control over.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          By agreeing to these terms, you understand that ATREE is only
          providing a means for communication between the various users of the
          Platform. We facilitate this communication by providing the Platform,
          but it is the users of the Platform who are responsible for the access
          and exchange of the content found within the Platform
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          Privacy Policy
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          Your privacy is very important to us. Please completely read and
          understand the following privacy policy before using the Platform. For
          the convenience of our readers, the Platform uses Google, Apple, and
          Facebook logins to verify credentials.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          1. Data Collection and Storage
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          By using the Platform you consent to the collection and use by
          ATREE/TEKDI? of certain types of data, such as but not limited to IP
          address, browser type, page visits, the time and date of visit,
          resources visited, time spent reading, and other usage information
          related to your experience in the library. The information is used to
          improve ATREE’s learning environment and the quality of resources
          offered to readers. For example, the data collected helps to suggest
          resources popular in the language you choose, suggesting languages
          based on your location and, if signed in helping to provide support
          based on your profile- as an educator, parent, student or others.
          Usage data from the platform is stored anonymously.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          Any data created during the use of the Platform is anonymized
          automatically when it is stored by ATREE. This data is retained for
          longitudinal analysis to better understand the preferences of our
          unique reading communities and measure growth over time.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          2. Cookies
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          Cookies are small text files that the Platform can send to your
          browser for storage on your computer's hard drive. They make your use
          of the Platform easier by saving your status and preferences and may
          be refreshed every time you visit. The Platform may use session
          cookies when you visit our website/app while your browser is open, or
          while you are logged into the Platform. To facilitate the registration
          and login functions, cookies may be used to recognize when you return
          to the Platform. If others will be using your computer or you are
          using a public computer such as in an Internet Café, school, or
          library, you should log out of your account so that your logon
          information is cleared. Most browser are initially set to accept
          cookies, but you may be able to change the settings to refuse cookies
          or to be alerted when cookies are being sent.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          3. Children's Privacy
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 400,
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            3.1 General Readers and Logged-in Readers.
          </span>{' '}
          ATREE does not collect personal information, regardless of age. ATREE
          highly encourages parents and legal guardians to review the privacy
          policies of the companies that provide log-in services to the Platform
          before using (Google, Apple, and Facebook). If you are a parent or
          legal guardian of a child under age 13 who you believe has submitted
          personal information to the Platform, please contact ATREE.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 400,
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            3.2 Translator Community.
          </span>{' '}
          The parts of the Platform that require personal information, such as
          your
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          4. Security
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          The Platform has security measures in place to protect the loss,
          misuse, and alteration of the information under our control. However,
          your confidential use of the Platform cannot be guaranteed by ATREE.
          ATREE shall not be responsible for any harm that you or any person may
          suffer as a result of a breach of confidentiality in respect to your
          use of the Platform or any information you transmitted to the Site.
        </Typography>

        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          5. Other Websites
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          Material on the Platform may link to independently run websites
          outside of the Jal Jungle Jameen in classrooms domain. ATREE is not
          responsible for the privacy practices or content of such websites. We
          encourage you to read the privacy policies of any websites you visit
          from this website.
        </Typography>

        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          6. Disclosure to Third Parties
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          No reader data is sold or traded to third parties.
        </Typography>

        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 400,
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            6.1 General Readers.
          </span>
          At times, Jal Jungle Jameen in classrooms may make information
          available for research, impact reports, or to strategic partners for
          analysis. If this occurs, any data shared is in anonymous, aggregated
          form that cannot be directly connected to individual users.
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 400,
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            6.2 Logged-in Readers Community.
          </span>{' '}
          By using Google, Apple, or Facebook logins when creating a Jal Jungle
          Jameen in classrooms profile, readers data are subject to the terms
          and privacy policies of these third parties. Readers and potential
          translator community members who would like to use these login options
          should refer to the respective terms and conditions before using these
          third-party logins.
        </Typography>
        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
          gutterBottom
        >
          6. Disclosure to Third Parties
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          XXXX. The Platform uses xxxxx to help support an issue ticketing
          system. When submitting an issue through xxxxx for the purpose of
          reporting any feedback, issues, or problematic content, readers are
          required to enter their email addresses and will be entered into the
          xxxx system. This feature is intended to create a better reading
          experience on the Platform for all and is only intended to be used by
          adults. Please refer to xxxx terms and conditions before using this
          service.
        </Typography>
      </Grid>
      {<FooterText page="" />}
    </Layout>
  );
}
