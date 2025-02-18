'use client';
import React, { useState } from 'react';
import { Button, FormLabel, TextField, Typography } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import { Layout } from '@shared-lib';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Otp from '../otp/page';

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [error, setError] = useState({
    email: false,
  });

  const [otp, setOtp] = React.useState('');

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

  const handleButtonClick = async () => {
    const redirectUrl = process.env.NEXT_PUBLIC_CONTENT;
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      console.error('NEXT_PUBLIC_CONTENT environment variable is not set');
    }
  };

  return (
    <Layout
      isFooter={false}
      showLogo={true}
      showBack={true}
      type="Image"
      showTopAppBar={{
        showSearch: true,
        title: 'Jal-Jungle-Jameen ',
        subtitle: 'In Classrooms ',
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
          marginTop: '60px',
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
          <FormLabel component="legend">Unlock with Your Email</FormLabel>

          <TextField
            id="outlined-email"
            label="Email ID"
            value={formData.email} // Use formData.password for the value
            onChange={handleChange('email')} // Ensure handleChange updates the form data
            type="text"
            variant="outlined"
            helperText={error.email ? 'Required email ID' : ''} // Display error message if password is required
            error={error.email} // Set error state if password has an error
          />
          <FormLabel component="legend">
            Enter the 6-digit code sent to your email
          </FormLabel>
          <Otp
            separator={<span></span>}
            value={otp}
            onChange={setOtp}
            length={6}
          />
          <Button
            onClick={handleButtonClick}
            sx={{
              color: '#FFFFFF',
              width: '100%',
              height: '40px',
              background:
                'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Proceed
          </Button>
          <Typography
            textAlign={'center'}
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            Don’t Have An Account? <Link href="/newUser">Sign Up </Link>
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}
