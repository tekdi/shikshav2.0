'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  FormLabel,
  IconButton,
  Typography,
  Alert,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { CommonTextField, trackEvent } from '@shared-lib';
import Link from 'next/link';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter } from 'next/router';
import { getUserAuthInfo, signin } from '../../service/content';
import Loader from '../../component/layout/LoaderComponent';
import Layout from '../../component/layout/layout';
import {
  dispatchLoginEvent,
  validateEmail,
  validatePassword,
} from '../../utils/authUtils';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';

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
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotData, setForgotData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    registeredWithGoogle: false,
  });
  const [forgotErrors, setForgotErrors] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpHash, setOtpHash] = useState('');
  const [otpTimer, setOtpTimer] = useState(600); // 600 seconds = 10 minutes

  // Auto-dismiss success alerts after 5 seconds
  useEffect(() => {
    if (alert.message && alert.severity === 'success') {
      const timer = setTimeout(() => {
        setAlert({ message: '', severity: 'success' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange =
    (field: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAlert({ message: '', severity: 'success' });
      const value = event.target.value.trim();
      let errorMessage = '';

      if (field === 'email') {
        if (!value) {
          errorMessage = 'Email id is required.';
        } else if (!validateEmail(value)) {
          errorMessage = 'Enter a valid registered email ID.';
        }
      } else if (field === 'password') {
        if (!value) {
          errorMessage = 'Password is required.';
        } else if (!validatePassword(value)) {
          errorMessage = 'Please enter password';
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
        if (authInfo?.result?.status !== 'archived') {
          const capitalizeFirstLetter = (word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1);
          const user = `${capitalizeFirstLetter(
            authInfo?.result?.firstName
          )} ${capitalizeFirstLetter(authInfo?.result?.lastName)}`.trim();
          localStorage.setItem('username', user);
          localStorage.setItem('userId', authInfo?.result?.userId);
          localStorage.setItem(
            'role',
            authInfo?.result?.tenantData?.[0]?.roleName
          );
          dispatchLoginEvent(user, 'credentials');
          setAlert({ message: 'Login successful!', severity: 'success' });
          trackEvent({
            action: 'signin',
            category: 'engagement',
            label: `Login successful - ${
              authInfo?.result?.userId || 'Anonymous'
            }`,
          });
          const windowUrl = window.location.pathname;
          const cleanedUrl = windowUrl.replace(/^\//, '');
          const env = cleanedUrl.split('/')[0];

          const telemetryInteract = {
            context: {
              env: env,
              cdata: [],
            },
            edata: {
              id: 'Login successful',
              type: TelemetryEventType.CLICK,
              subtype: '',
              pageid: cleanedUrl,
              uid: authInfo?.result?.userId || 'Anonymous',
            },
          };
          telemetryFactory.interact(telemetryInteract);
          router.push('/home');
        } else {
          setAlert({
            message: 'Your account has been deleted.',
            severity: 'error',
          });
        }
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


  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(
        () => {
          setAlert({ message: '', severity: 'success' });
        },
        alert.severity === 'error' ? 2000 : 5000
      ); // 2 seconds for errors, 5 seconds for others
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <Layout showTopAppBar>
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
              mt: { xs: 2, sm: 8 },
              p: { xs: 2, sm: 4 },
              bgcolor: '#ffffff',
              position: 'relative',
              boxShadow: {
                xs: 'none',
                sm: '0px 8px 24px rgba(0, 0, 0, 0.2)',
              },
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
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 4,
                fontWeight: 500,
                fontSize: { xs: '22px !important', sm: '24px !important' },
                color: '#000000',
                fontFamily: 'Poppins',
                textAlign: 'center',
              }}
            >
              Sign Up/Login
            </Typography>
            <Grid container direction="column" spacing={3}>
              {['email', 'password'].map((field) => (
                <Grid
                  item
                  key={field}
                  container
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Grid item xs={12} sm={4}>
                    <FormLabel
                      component="label"
                      sx={{
                        color: '#000000',
                        fontWeight: 500,
                        fontSize: '16px',
                        fontFamily: 'poppins',
                        marginBottom: 1,
                      }}
                    >
                      {field === 'email' ? 'Username' : 'Password'}
                      &nbsp; <span style={{ color: 'red' }}> *</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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

              <Grid item>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={10} sm={8} md={6}>
                    <Button
                      onClick={handleSigninClick}
                      sx={{
                        width: '100%',
                        height: '48px',
                        backgroundColor: '#fcd804',
                        color: '#000000',
                        borderRadius: '30px',
                        fontSize: '16px',
                        fontWeight: 500,
                        fontFamily: 'Poppins',
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

                  {/* <Grid item xs={10} sm={8} md={6}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '48px',
                        '& button': {
                          width: '100% !important',
                          height: '48px !important',
                          borderRadius: '30px !important',
                          boxShadow: '0px 4px 12px rgba(0,0,0,0.1) !important',
                        },
                      }}
                    >
                      <GoogleOAuthProvider
                        clientId={
                          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''
                        }
                      >
                        <MyCustomGoogleLogin />
                      </GoogleOAuthProvider>
                    </Box>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid item textAlign="center">
                <Typography
                  fontSize="16px"
                  color="#000000"
                  sx={{
                    color: '#0037B9',
                    fontWeight: 500,
                    fontFamily: 'poppins',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    try {
                      await router.push('/forgot-password');
                    } catch (error) {
                      console.error('Navigation failed:', error);
                    }
                  }}
                >
                  Forgot Password?
                </Typography>
              </Grid>
              <Grid item textAlign="center">
                <Typography
                  fontSize="16px"
                  color="#000000"
                  sx={{ fontWeight: 500, fontFamily: 'Poppins' }}
                >
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    style={{
                      color: '#0037B9',
                      fontWeight: 500,
                      fontFamily: 'poppins',
                      textDecoration: 'underline',
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Alert component - now appears above dialogs */}
      {alert.message && (
        <Box
          display="flex"
          justifyContent="center"
          position="fixed"
          top={24}
          left={0}
          right={0}
          sx={{
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <Alert
            variant="filled"
            severity={alert.severity}
            sx={{
              pointerEvents: 'auto',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => setAlert({ message: '', severity: 'success' })}
          >
            {alert.message}
          </Alert>
        </Box>
      )}
 
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
        const user = keycloak.tokenParsed?.preferred_username || 'Unknown User';

        dispatchLoginEvent(user, 'google');
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
          width: '85%',
          height: '48px',
          background: 'transparent',
          color: '#2B3133',
          borderRadius: '30px',
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'poppins',
          textTransform: 'none',
          border: '2px solid #fcd804',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}
        onClick={() => handleLogin()}
      >
        <Box display="flex" alignItems="center" gap="8px">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={{ width: 24, height: 24 }}
          />
          <Typography>Google Login</Typography>
        </Box>
      </Button>
    </Box>
  );
};
