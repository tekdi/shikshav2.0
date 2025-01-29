'use client';
import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import {
  CommonCheckbox,
  CommonSelect,
  CommonTextField,
  Layout,
  // login,
} from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { getToken } from '../../services/LoginService';
import { useRouter } from 'next/navigation';
const languageData = [
  { id: 1, name: 'English' },
  { id: 2, name: 'Marathi' },
  { id: 3, name: 'Hindi' },
];

const checkboxData = [{ label: 'Remember Me' }];

export default function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState({
    userName: false,
    password: false,
  });
  const [selectedValue, setSelectedValue] = useState('english');
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    label: string
  ) => {
    setChecked(checked);
    console.log(
      `Checkbox '${label}' is now ${checked ? 'checked' : 'unchecked'}`
    );
  };

  const handleButtonClick = async () => {
    if (!formData.userName || !formData.password) {
      setError({
        userName: !formData.userName,
        password: !formData.password,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await getToken({
        username: formData.userName,
        password: formData.password,
      });

      if (response?.access_token) {
        localStorage.setItem('accToken', response?.access_token);
        localStorage.setItem('refToken', response?.refresh_token);
        const redirectUrl = process.env.NEXT_PUBLIC_CONTENT;
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } else {
        setShowError(true);
        setErrorMessage(response);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setShowError(true);
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
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
            <img
              src="/assets/images/logo-tekdi.png"
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
        >
          {/* <CommonSelect
            label=""
            value={selectedValue}
            onChange={handleSelectChange}
            options={languageData.map(({ name }) => ({
              label: name,
              value: name.toLowerCase(),
            }))}
            width="100px"
            height="32px"
            borderRadius="8px"
          /> */}
          <CommonTextField
            label="Username"
            value={formData.userName}
            onChange={handleChange('userName')}
            type="text"
            variant="outlined"
            helperText={error.userName ? `Required username ` : ''}
            error={error.userName}
          />
          <CommonTextField
            label="Password"
            value={formData.password}
            onChange={handleChange('password')}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            helperText={error.password ? `Required password ` : ''}
            error={error.password}
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
          {/* <Typography
            variant="h1"
            fontSize="14px"
            color="#1D1B20"
            fontWeight={500}
          >
            Forgot Password?
          </Typography>

          <CommonCheckbox
            checkboxes={checkboxData}
            onChange={handleCheckboxChange}
            direction="row"
          /> */}

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
          {/* <Typography
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            Don’t Have An Account? <Link href="/newUser">Register </Link>
          </Typography> */}
        </Grid>
      </Grid>
      {showError && (
        <Alert variant="filled" severity="error">
          {errorMessage}
        </Alert>
      )}
    </Layout>
  );
}
