'use client';
import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import {
  Button,
  FormLabel,
  IconButton,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommonTextField } from '@shared-lib';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { signin } from '../services/LoginService';
import { Visibility, VisibilityOff } from '@mui/icons-material';


import keycloak from '../services/keycloack';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlertMsg, setShowAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Clear localStorage when the Sign-in page loads
    localStorage.clear();
  }, []);
  const handleChange =
    (field: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowAlertMsg('');

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
              setShowAlertMsg('Login successfully!');
              setAlertSeverity('success');
              localStorage.setItem('token', token);
              localStorage.setItem('refreshToken', refreshToken);
              router.push('/home');
            }
          }
        } else if (response?.status === 404) {
          setShowAlertMsg(response?.response?.data?.params?.errmsg);
          setAlertSeverity('error');
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
            Username<span style={{ color: 'red' }}>*</span>
          </FormLabel>

          <CommonTextField
            value={email}
            onChange={handleChange('email')}
            type={'text'}
            variant="outlined"
            helperText={emailError ? `Enter valid Email ID ` : ''}
            error={emailError}
          />
          <FormLabel component="legend" sx={{ color: '#4D4639' }}>
            Password<span style={{ color: 'red' }}>*</span>
          </FormLabel>

          <CommonTextField
            value={password}
            onChange={handleChange('password')}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            helperText={passwordError ? `Enter valid password ` : ''}
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

          <Button
            onClick={handleSigninClick}
            sx={{
              color: '#2B3133',
              width: { xs: '80%', sm: '60%', md: '50%' }, // Responsive width
              height: '44px',
              background: '#FFBD0D',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
              alignSelf: 'center', // Centers in flex container
              mx: 'auto',
            }}
          >
            Proceed
          </Button>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}
          >
            <MyCustomGoogleLogin />
          </GoogleOAuthProvider>
          <Typography
            textAlign={'center'}
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            Don't Have An Account?{' '}
            <Link href="/register" style={{ color: '#0037B9' }}>
              Sign up
            </Link>
          </Typography>
        </Grid>
        {showAlertMsg && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            sx={{ pointerEvents: 'none', bgcolor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => setShowAlertMsg('')}
          >
            <Alert
              variant="filled"
              severity={alertSeverity}
              sx={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {showAlertMsg}
            </Alert>
          </Box>
        )}
      </Grid>
  );
}
const MyCustomGoogleLogin = () => {
  const router = useRouter();

  const handleLogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Google Auth Token:', response);
      localStorage.setItem('token', response.access_token);
      router.push('/home');
    },
    flow: 'implicit', // Ensures no full-page reload
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });
  // const handleLogin = async () => {
  //   console.log(keycloak);
  //   await keycloak?.login({
  //     // idpHint: 'google', // This tells Keycloak to use Google SSO
  //   });
  // };

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#ffffff',
        width: { xs: '80%', sm: '60%', md: '50%' },
        border: '1px solid #FFBD0D',
        height: '44px',
        borderRadius: '40px',
        color: '#000',
        textTransform: 'none',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: 'none',
        alignSelf: 'center', // Centers in flex container
        mx: 'auto',
        '&:hover': { backgroundColor: '#f5f5f5' },
      }}
      onClick={() => handleLogin()} // Manually trigger login
    >
      <Box display="flex" alignItems="center" gap="10px">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          style={{ width: 24, height: 24 }}
        />
        <Typography>Log in with Google</Typography>
      </Box>
    </Button>
  );
};
