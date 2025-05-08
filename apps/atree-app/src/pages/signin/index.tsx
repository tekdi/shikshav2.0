'use client';
import React, { useState } from 'react';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter } from 'next/router';
import { getUserAuthInfo, signin } from '../../service/content';
import Loader from '../../component/layout/LoaderComponent';
import Layout from '../../component/layout/layout';

interface ListProps {}
const commonButtonStyle = {
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
};
const Login: React.FC<ListProps> = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[a-zA-Z][a-zA-Z0-9._]{2,}$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleChange =
    (field: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAlert({ message: '', severity: 'success' });
      const value = event.target.value.trim();
      let errorMessage = '';

      if (field === 'email') {
        if (!value) {
          errorMessage = 'Username is required.';
        } else if (!validateEmail(value)) {
          errorMessage = 'Enter valid username.';
        }
      } else if (field === 'password') {
        if (!value) {
          errorMessage = 'Password is required.';
        } else if (!validatePassword(value)) {
          errorMessage =
            'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
        }
      }
      setCredentials((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

  const handleSigninClick = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      errors.email ||
      errors.password ||
      !credentials.email ||
      !credentials.password
    )
      return;
    setLoading(true);
    try {
      const response = await signin(credentials);

      if (response?.result?.access_token) {
        localStorage.setItem('token', response.result.access_token);
        localStorage.setItem('refreshToken', response.result.refresh_token);
        const authInfo = await getUserAuthInfo({
          token: response?.result?.access_token,
        });
        const capitalizeFirstLetter = (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1);
        const user = `${capitalizeFirstLetter(
          authInfo?.result?.firstName
        )} ${capitalizeFirstLetter(authInfo?.result?.lastName)}`.trim();
        localStorage.setItem('username', user);
        localStorage.setItem(
          'role',
          authInfo?.result?.tenantData?.[0]?.roleName
        );
        setAlert({ message: 'Login successful!', severity: 'success' });
        router.push('/home');
      } else {
        setAlert({
          message: response?.response?.data?.params?.errmsg || 'Login failed',
          severity: 'error',
        });
      }
    } catch {
      setAlert({ message: 'An error occurred.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <Box>
        {loading ? (
          <Loader />
        ) : (
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
                mt: 4,
              }}
            >
              {/* <ImageCenter /> */}
              {['email', 'password'].map((field) => (
                <Box key={field + '1'}>
                  <FormLabel component="legend" sx={{ color: '#4D4639' }}>
                    {field === 'email' ? 'Username' : 'Password'}
                    <span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                  <CommonTextField
                    value={credentials[field as 'email' | 'password']}
                    onChange={handleChange(field as 'email' | 'password')}
                    type={
                      field === 'password' && !showPassword
                        ? 'password'
                        : 'text'
                    }
                    variant="outlined"
                    helperText={errors[field as 'email' | 'password']}
                    error={!!errors[field as 'email' | 'password']}
                    endIcon={
                      field === 'password' && (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      )
                    }
                  />
                </Box>
              ))}

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
            {alert.message && (
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
                onClick={() => setAlert({ message: '', severity: 'success' })}
              >
                <Alert
                  variant="filled"
                  severity={alert.severity}
                  sx={{ pointerEvents: 'auto' }}
                  onClick={() => setAlert({ message: '', severity: 'success' })}
                >
                  {alert.message}
                </Alert>
              </Box>
            )}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Login;
const MyCustomGoogleLogin = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = async () => {
    try {
      await keycloak.login({
        idpHint: 'google',
        // redirectUri: `${window.location.origin}/home`,
      });
      if (keycloak.authenticated && keycloak.token) {
        localStorage.setItem('token', keycloak.token || '');
        localStorage.setItem('refreshToken', keycloak.refreshToken || '');
        console.log('keycloak.token', keycloak.token);
      } else {
        console.error('No token received after login.');
      }
    } catch (error) {
      console.error('Login Failed', error);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        sx={commonButtonStyle}
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
    </Box>
  );
};
