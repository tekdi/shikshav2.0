'use client';
import React, { useState } from 'react';
import { Box, Button, FormLabel, Typography } from '@mui/material';
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
import { jwtDecode } from 'jwt-decode';
const languageData = [
  { id: 1, name: 'Educator' },
  { id: 2, name: 'Mentor' },
  { id: 3, name: 'Student' },
];

const checkboxData = [{ label: 'Remember Me' }];

export default function Signup() {
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
    // if (!formData.userName || !formData.password) {
    //   setError({
    //     userName: !formData.userName,
    //     password: !formData.password,
    //   });
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const response = await getToken({
    //     username: formData.userName,
    //     password: formData.password,
    //   });

    //   if (response?.access_token) {
    //     localStorage.setItem('accToken', response?.access_token);
    //     localStorage.setItem('refToken', response?.refresh_token);
    //     const decoded = jwtDecode(response?.access_token);
    //     const subId = decoded?.sub?.split(':')[2];
    //     document.cookie = `subid=${subId}; path=/;`;
    //     const redirectUrl = process.env.NEXT_PUBLIC_CONTENT;
    //     if (redirectUrl) {
    //       router.push(redirectUrl);
    //     }
    //   } else {
    //     setShowError(true);
    //     setErrorMessage(response);
    //   }
    // } catch (error: any) {
    //   console.error('Login failed:', error);
    //   setShowError(true);
    //   setErrorMessage(error);
    // } finally {
    //   setLoading(false);
    // }
    router.push('/verifyOTP');
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
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
          <FormLabel component="legend">Full Name</FormLabel>
          <CommonTextField
            label="Full Name"
            value={formData.userName}
            onChange={handleChange('userName')}
            type="text"
            variant="outlined"
            helperText={error.userName ? `Enter full name ` : ''}
            error={error.userName}
          />
          <FormLabel component="legend">Email ID</FormLabel>

          <CommonTextField
            label="Email ID"
            value={formData.password}
            onChange={handleChange('password')}
            type={'text'}
            variant="outlined"
            helperText={error.password ? `Enter Email ID ` : ''}
            error={error.password}
          />
          <FormLabel component="legend">Select Role</FormLabel>
          <CommonSelect
            label="Select Role"
            value={selectedValue}
            onChange={handleSelectChange}
            options={languageData.map(({ name }) => ({
              label: name,
              value: name.toLowerCase(),
            }))}
            // borderRadius="8px"
          />

          <Button
            disabled={loading}
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
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Proceed'
            )}
          </Button>
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
      {showError && (
        <Alert variant="filled" severity="error">
          {errorMessage}
        </Alert>
      )}
    </Layout>
  );
}
