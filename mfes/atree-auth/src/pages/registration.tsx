'use client';
import React, { useState } from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommonSelect, CommonTextField, Layout } from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
const languageData = [
  { id: 1, name: 'Educator' },
  { id: 2, name: 'Mentor' },
  { id: 3, name: 'Student' },
];

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState({
    name: false,
    email: false,
  });
  const [selectedValue, setSelectedValue] = useState('Educator');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData({
        ...formData,
        [field]: value,
      });
      setError({
        ...error,
        [field]: value.trim() === '',
      });
    };

  const handleSigninClick = async () => {
    // router.push('/verifyOTP');
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };
  const handleLoginSuccess = (response: any) => {
    // Get the token and process it
    const token = response.credential;
    console.log('Google Login Success:', token);

    // Fetch user info using token if needed (optional)
    // For example, you can make an API call to validate the token and retrieve user info

    // Assuming the login is successful, you can set user data and navigate
    setUser(token);
    router.push('/dashboard'); // Redirect to the dashboard or the desired route
  };

  const handleLoginFailure = () => {
    console.error('Google Login Failure:');
  };

  return (
    <Layout
      isFooter={false}
      showLogo={true}
      showBack={true}
      showTopAppBar={{
        title: 'Jal-Jungle-Jameen ',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
      }}
      // sx={{ height: '100vh' }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          width: '100%',
          borderRadius: 1,
          bgcolor: '#FFFFFF',
          justifyContent: 'center',

          padding: 2,
          mx: 'auto',
        }}
      >
        <Grid
          size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: '20px 20px 0 0',
            padding: '15px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <FormLabel component="legend">Full Name</FormLabel>
          <CommonTextField
            value={formData.name}
            onChange={handleChange('name')}
            type="text"
            variant="outlined"
            helperText={error.name ? `Enter full name ` : ''}
            error={error.name}
          />
          <FormLabel component="legend">Email ID</FormLabel>

          <CommonTextField
            value={formData.email}
            onChange={handleChange('email')}
            type={'text'}
            variant="outlined"
            helperText={error.email ? `Enter Email ID ` : ''}
            error={error.email}
          />
          <FormLabel component="legend">Select Role</FormLabel>
          <CommonSelect
            value={selectedValue}
            onChange={handleSelectChange}
            options={languageData.map(({ name }) => ({
              label: name,
              value: name.toLowerCase(),
            }))}
            // borderRadius="8px"
          />

          <Button
            onClick={handleSigninClick}
            sx={{
              color: '#2B3133',
              width: '100%',
              height: '40px',
              background:
                'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Proceed
          </Button>
          <GoogleOAuthProvider clientId="467709515234-qu171h5np0rae7vrl23uv1audjht7fsa.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              useOneTap
              theme="outline"
            />
          </GoogleOAuthProvider>
          <Typography
            textAlign={'center'}
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            Already Have An Account? <Link href="/newUser">Log In </Link>
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}
