'use client';
import React, { useState } from 'react';
import {
  Button,
  FormLabel,
  IconButton,
  Typography,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { CommonTextField } from '@shared-lib';
import Link from 'next/link';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter } from 'next/router';
import { getUserAuthInfo, signin } from '../../service/content';
import Loader from '../../component/layout/LoaderComponent';
import Layout from '../../component/layout/layout';
import { commonButtonStyle } from '../../utils/commonStyle';
import { validateEmail, validatePassword } from '../../utils/authUtils';

interface ListProps {}

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
          <Paper
            elevation={6}
            sx={{
              maxWidth: 600,
              width: '100%',
              borderRadius: 8,
              overflow: 'hidden',
              mx: 'auto',
              mt: 5,
              p: { xs: 3, sm: 4 },
              bgcolor: '#ffffff',
              position: 'relative', // For gradient shadow effect
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                right: '-8px',
                bottom: '-8px',
                background: 'linear-gradient(90deg, #FFBD0D 0%, #fcb900 100%)',
                zIndex: -1,
                borderRadius: 'inherit',
                filter: 'blur(6px)',
              },
            }}
          >
            <Grid container direction="column" spacing={3}>
              {['email', 'password'].map((field) => (
                <Grid
                  item
                  key={field}
                  container
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Grid item xs={4}>
                    <FormLabel
                      component="label"
                      sx={{
                        color: '#4D4639',
                        fontWeight: 700,
                        fontSize: '1rem',
                        marginBottom: 1,
                      }}
                    >
                      {field === 'email' ? 'Username' : 'Password'}
                      <span style={{ color: 'red' }}>*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={6}>
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
                      fullWidth
                      sx={{ mt: 0 }}
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
                  </Grid>
                </Grid>
              ))}

              {/* Proceed and Google buttons */}
              <Grid item>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={8} md={5}>
                    <Button
                      onClick={handleSigninClick}
                      sx={{
                        width: '100%',
                        height: '48px',
                        background:
                          'linear-gradient(90deg, #FFBD0D 0%, #fcb900 100%)',
                        color: '#2B3133',
                        borderRadius: '30px',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#e6a90b',
                        },
                      }}
                    >
                      Proceed
                    </Button>
                  </Grid>
                  <Grid item xs={8} md={5}>
                    <GoogleOAuthProvider
                      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}
                    >
                      <MyCustomGoogleLogin />
                    </GoogleOAuthProvider>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item textAlign="center">
                <Typography fontSize="15px" color="#3B383E">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    style={{
                      color: '#0037B9',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Grid>
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
                sx={{
                  pointerEvents: 'auto',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                }}
                onClick={() => setAlert({ message: '', severity: 'success' })}
              >
                <Alert
                  variant="filled"
                  severity={alert.severity}
                  sx={{ pointerEvents: 'auto' }}
                >
                  {alert.message}
                </Alert>
              </Box>
            )}
          </Paper>
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
      });
      if (keycloak.authenticated && keycloak.token) {
        localStorage.setItem('token', keycloak.token || '');
        localStorage.setItem('refreshToken', keycloak.refreshToken || '');
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
        variant="outlined"
        sx={{
          width: '100%',
          height: '48px',
          background: 'transparent',
          color: '#2B3133',
          borderRadius: '30px',
          fontSize: '16px',
          fontWeight: 600,
          textTransform: 'none',
          border: '2px solid #FFBD0D',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: '#fcb900',
          },
        }}
        onClick={() => handleLogin()}
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
