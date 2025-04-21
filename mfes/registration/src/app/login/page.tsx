'use client';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AlertTitle, Box, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import { CommonTextField, Layout } from '@shared-lib';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { login } from '../../services/LoginService';
import AppConst from '../../utils/AppConst/AppConst';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState({
    userName: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
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
    setLoading(true);
    try {
      const {
        result: response,
        authUser,
        tenantInfo: info,
      } = await login({
        username: formData.userName,
        password: formData.password,
      });
      const tenantInfo = info.find(
        (tenant: any) => tenant.tenantId === authUser?.tenantData?.[0]?.tenantId
      );
      if (
        response?.access_token &&
        authUser?.tenantData?.[0]?.tenantId &&
        tenantInfo
      ) {
        localStorage.setItem('accToken', response?.access_token);
        localStorage.setItem('refToken', response?.refresh_token);
        localStorage.setItem('userId', authUser?.userId);
        localStorage.setItem('userName', authUser?.username);
        const { contentFramework: framework, channelId: channel } = tenantInfo;
        console.log('response', channel);
        localStorage.setItem('framework', framework);
        localStorage.setItem('tenant-code', channel);
        localStorage.setItem('tenantId', authUser?.tenantData?.[0]?.tenantId);
        document.cookie = `subid=${authUser?.userId}; path=/;`;
        document.cookie = `token=${
          response?.access_token
        }; path=/; SameSite=Strict; ${
          window.location.protocol === 'https:' ? 'Secure;' : ''
        }`;
        document.cookie = `tenantId=${
          authUser?.tenantData?.[0]?.tenantId
        }; path=/; SameSite=Strict; ${
          window.location.protocol === 'https:' ? 'Secure;' : ''
        }`;
        document.cookie = `userId=${authUser?.userId}; path=/;`;
        document.cookie = `tenant-code=${channel}; path=/;`;

        const redirectUrl = process.env.NEXT_PUBLIC_CONTENT;

        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } else {
        if (!response?.access_token) {
          setErrorMessage(['Invalid tenantId or access token']);
        } else if (!authUser?.tenantData?.[0]?.tenantId) {
          setErrorMessage(['Invalid tenantId']);
        } else if (!tenantInfo) {
          setErrorMessage(['not found tenant config']);
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrorMessage([error.message, error?.response?.data?.params?.errmsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    router.push('/forgot-password');
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
            label="Username"
            value={formData.userName}
            onChange={handleChange('userName')}
            type="text"
            variant="outlined"
            helperText={error.userName ? `Required username ` : ''}
            error={error.userName}
          />
          <CommonTextField
            InputLabelProps={{ shrink: true }}
            label="Password"
            value={formData.password}
            onChange={handleChange('password')}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            helperText={error.password ? `Required password ` : ''}
            error={error.password}
            //@ts-ignore
            InputProps={{
              endAdornment: !showPassword ? (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <VisibilityIcon
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                />
              ),
            }}
          />
          <Box sx={{ textAlign: 'left' }}>
            <Button
              variant="text"
              onClick={handleForgotPasswordClick}
              sx={{
                color: '#6750A4',
                fontSize: '14px',
                fontWeight: 500,
                padding: 0,
              }}
            >
              Forgot Password?
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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
