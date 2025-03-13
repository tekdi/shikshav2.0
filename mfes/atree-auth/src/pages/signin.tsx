'use client';
import React, { useState } from 'react';
import { Button, FormLabel, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommonTextField } from '@shared-lib';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// import Otp from './otp';
import { signin } from '../services/LoginService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
export default function Signin() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange =
    (field: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (field === 'email') {
        setEmail(value);
        setEmailError(value.trim() === '');
      } else {
        setPassword(value);
        setPasswordError(value.trim() === '');
      }
    };

  const handleSigninClick = async (event: React.FormEvent) => {
    // router.push('/verifyOTP');
    event.preventDefault();
    if (!email.trim()) {
      setEmailError(true);
    }
    if (!password.trim()) {
      setPasswordError(true);
    }
    if (!emailError && !passwordError) {
      setLoading(true);

      try {
        const response = await signin({ email, password });

        if (response?.result?.access_token) {
          if (typeof window !== 'undefined' && window.localStorage) {
            const token = response.result.access_token;
            const refreshToken = response?.result?.refresh_token;

            if (token) {
              localStorage.setItem('token', token);
              localStorage.setItem('refreshToken', refreshToken);
            }
          }
        } else if (response?.status === 404) {
          console.log('error', response?.response?.data?.params?.errmsg);
        }
      } catch (error: any) {
        setLoading(false);
      }
    }
  };

  const handleLoginSuccess = (response: any) => {
    // Get the token and process it
    const token = response.credential;
    console.log('Google Login Success:', token);

    router.push('/dashboard');
  };

  const handleLoginFailure = () => {
    console.error('Google Login Failure:');
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        flex: 1,
        width: '100%',
        borderRadius: 1,
        bgcolor: '#FFFFFF',
        justifyContent: 'center',

        //   padding: 2,
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
        <FormLabel component="legend" sx={{ color: '#4D4639' }}>
          Username
        </FormLabel>

        <CommonTextField
          value={email}
          onChange={handleChange('email')}
          type={'text'}
          variant="outlined"
          helperText={emailError ? `Enter Email ID ` : ''}
          error={emailError}
        />
        <FormLabel component="legend" sx={{ color: '#4D4639' }}>
          Password
        </FormLabel>

        <CommonTextField
          value={password}
          onChange={handleChange('password')}
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          helperText={passwordError ? `Enter password ` : ''}
          error={passwordError}
          endIcon={
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          }
        />
        {/* <FormLabel component="legend" sx={{ color: '#4D4639' }}>
          Enter the 6-digit code sent to your email
        </FormLabel>
        <Otp
          separator={<span></span>}
          value={otp}
          onChange={setOtp}
          length={5}
        />
        <Typography>Request to Resend OTP in 4:59</Typography> */}
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
        {/* <GoogleOAuthProvider clientId="467709515234-qu171h5np0rae7vrl23uv1audjht7fsa.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap
            theme="outline"
          />
        </GoogleOAuthProvider> */}
        <Typography
          textAlign={'center'}
          variant="h1"
          fontSize={'16px'}
          color="#3B383E"
          fontWeight={500}
        >
          Already Have An Account?{' '}
          <Link href="/register" style={{ color: '#0037B9' }}>
            Sign up{' '}
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
}
