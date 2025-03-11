import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  CommonDialog,
  CommonSelect,
  CommonTextField,
  Layout,
} from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import Otp from './otp';
import { createUser } from '../services/LoginService';
import TermsAndCondition from './components/TermsAndCondition';

const languageData = [
  { id: 1, name: 'Educator' },
  { id: 2, name: 'Mentor' },
  { id: 3, name: 'Student' },
];

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState({
    name: false,
    email: false,
    otp: false,
  });

  const [selectedValue, setSelectedValue] = useState('Educator');
  const [otpShow, setOtpShow] = useState(false);
  const [otp, setOtp] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const router = useRouter();

  // **Validation Functions**
  const validateName = (name: string) => {
    return name.trim().split(' ').length >= 2;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateOtp = (otp: string) => {
    return /^\d{5}$/.test(otp);
  };

  // **Handle Change**
  const handleChange =
    (field: 'name' | 'email') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData({ ...formData, [field]: value });

      setError({
        ...error,
        [field]:
          field === 'name' ? !validateName(value) : !validateEmail(value),
      });
    };
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };
  const handleSigninClick = () => {
    if (!validateName(formData.name) || !validateEmail(formData.email)) {
      setError({
        name: !validateName(formData.name),
        email: !validateEmail(formData.email),
        otp: false,
      });
      return;
    }
    setOtpShow(true);
  };

  const handleCreateUser = async () => {
    if (!validateOtp(otp)) {
      setError({ ...error, otp: true });
      return;
    }

    try {
      const [firstName, ...lastNameArr] = formData.name.trim().split(' ');
      const lastName = lastNameArr.join(' ');

      const payload = {
        firstName,
        lastName,
        username: formData.email,
        password: otp,
        mobile: '',
        gender: '',
      };
      const response = await createUser(payload);

      if (response?.result?.access_token) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', response.result.access_token);
          localStorage.setItem('refreshToken', response.result.refresh_token);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleChangeOPenTermsAndCondition = () => {
    setOpenTermsDialog(true);
    setTermsAccepted(!termsAccepted);
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
        // padding: 2,
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
        {!otpShow && (
          <>
            <FormLabel component="legend">Full Name</FormLabel>
            <CommonTextField
              value={formData.name}
              onChange={handleChange('name')}
              type="text"
              variant="outlined"
              helperText={error.name ? 'Enter full name (First and Last)' : ''}
              error={error.name}
            />
          </>
        )}

        <FormLabel component="legend">Email ID</FormLabel>
        <CommonTextField
          value={formData.email}
          onChange={handleChange('email')}
          type="text"
          variant="outlined"
          helperText={error.email ? 'Enter a valid Email ID' : ''}
          error={error.email}
        />

        {/* {otpShow && (
          <>
            <FormLabel component="legend">
              Enter the 6-digit OTP sent to your email
            </FormLabel>
            <Otp
              separator={<span></span>}
              value={otp}
              onChange={handleOtpChange}
              length={5}
            />
            {error.otp && (
              <Typography color="error" fontSize="12px">
                Please enter a valid 6-digit OTP.
              </Typography>
            )}
            <Typography>Request to Resend OTP in 4:59</Typography>
          </>
        )} */}

        <FormLabel component="legend">Select Role</FormLabel>
        <CommonSelect
          value={selectedValue}
          onChange={(event: SelectChangeEvent) =>
            setSelectedValue(event.target.value)
          }
          options={languageData.map(({ name }) => ({
            label: name,
            value: name.toLowerCase(),
          }))}
        />

        {/* {otpShow ? ( */}
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={handleChangeOPenTermsAndCondition}
                sx={{
                  '&.Mui-checked': {
                    color: '#2B3133',
                  },
                  '& .MuiSvgIcon-root': {
                    backgroundColor: '#FFBD0D',
                    borderRadius: '4px',
                  },
                }}
              />
            }
            label={
              <Typography fontSize="14px">
                I have read and accepted the{' '}
                <Link
                  href="#"
                  onClick={handleChangeOPenTermsAndCondition}
                  style={{ color: '#0047D4', textDecoration: 'underline' }}
                >
                  Terms and Conditions
                </Link>
                .
              </Typography>
            }
          />

          {/* Additional Text */}
          <Typography fontSize="14px" color="#3B383E">
            Lorem ipsum dolor sit amet consectetur. Purus pretium leo semper
            eget mi. Convallis nunc sed dis amet tristique sed. Ullamcorper
            risus. Lorem ipsum dolor sit amet consectetur. Purus pretium leo
            semper eget mi. Convallis nunc sed dis amet tristique sed.
            Ullamcorper risus.
          </Typography>
          <Button
            onClick={handleCreateUser}
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
            disabled={
              // otp.length !== 5 || (isNaN(Number(otp)) && !termsAccepted)
              !formData.name || !formData.email
            }
          >
            Verify & Proceed
          </Button>
        </>
        {/* ) : (
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
            disabled={!formData.name || !formData.email}
          >
            Proceed
          </Button>
        )} */}

        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <GoogleLogin
            onSuccess={() => {}}
            onError={() => {}}
            useOneTap
            theme="outline"
          />
        </GoogleOAuthProvider>

        <Typography
          textAlign="center"
          fontSize="16px"
          color="#3B383E"
          fontWeight={500}
        >
          Don’t Have An Account? <Link href="/signin">Log In</Link>
        </Typography>
      </Grid>

      <CommonDialog
        isOpen={openTermsDialog}
        onClose={() => setOpenTermsDialog(false)}
        header="Terms and Conditions"
        content={<TermsAndCondition />}
        actions={
          <Button
            onClick={() => setOpenTermsDialog(false)}
            sx={{
              color: '#2B3133',
              width: '100%',
              height: '40px',
              background:
                'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Close
          </Button>
        }
      />
    </Grid>
  );
}
