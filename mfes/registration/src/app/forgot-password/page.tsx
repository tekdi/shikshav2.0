'use client';
import { AlertTitle, Box, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import { CommonTextField, Layout } from '@shared-lib';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { resetPasswordLink } from '../../services/LoginService';
import AppConst from '../../utils/AppConst/AppConst';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [error, setError] = useState({
    email: false,
  });
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const URL_CONTENT = process.env.NEXT_PUBLIC_CONTENT;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accToken = localStorage.getItem('accToken');
      const refToken = localStorage.getItem('refToken');
      if (accToken && refToken) {
        if (URL_CONTENT) {
          router.replace(URL_CONTENT);
        }
      }
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (!localStorage.getItem('did')) {
          const fp = await FingerprintJS.load();
          const { visitorId } = await fp.get();
          localStorage.setItem('did', visitorId);
          console.log('Device fingerprint generated successfully');
        }
      } catch (error) {
        console.error('Error generating device fingerprint:', error);
      }
    };
    init();
  }, []);

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
    if (!formData.email) {
      setError({
        email: !formData.email,
      });
      return;
    }
    setLoading(true);
    try {
      const { result: response } = await resetPasswordLink({
        email: formData.email,
      });
      if (response) {
        setErrorMessage(['Email sent successfully']);
      } else {
        setErrorMessage(['Error sending email']);
      }
    } catch (error: any) {
      console.error('Forgot Password failed:', error);
      setErrorMessage([error.message, error?.response?.data?.params?.errmsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <Layout
      isFooter={false}
      showLogo={true}
      showBack={true}
      sx={{ height: '100vh' }}
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
          height: '100vh',
          padding: 2,
          mx: 'auto',
        }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Grid
            container
            sx={{
              height: '100%',
              backgroundColor: '#444444',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={`${AppConst.BASEPATH}/assets/images/logo-tekdi.png`}
              alt="Company Logo"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Grid>
        </Grid>

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
          justifyContent={{ sm: 'center', md: 'center' }}
        >
          <CommonTextField
            InputLabelProps={{ shrink: true }}
            label="Email"
            value={formData.email}
            onChange={handleChange('email')}
            type="text"
            variant="outlined"
            helperText={error.email ? `Required email ` : ''}
            error={error.email}
          />
          <Box sx={{ textAlign: 'left' }}>
            <Button
              variant="text"
              onClick={handleLoginClick}
              sx={{
                color: '#6750A4',
                fontSize: '14px',
                fontWeight: 500,
                padding: 0,
              }}
            >
              Back to Login
            </Button>
          </Box>
          <Button
            disabled={loading}
            onClick={handleButtonClick}
            sx={{
              color: '#FFFFFF',
              width: '100%',
              height: '40px',
              bgcolor: '#6750A4',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Grid>
      </Grid>
      {Array.isArray(errorMessage) && errorMessage.length > 0 && (
        <Alert variant="filled" severity="error">
          <AlertTitle>Error</AlertTitle>
          <ul style={{ margin: 0, paddingInlineStart: '15px' }}>
            {errorMessage.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Layout>
  );
}
