'use client';
import { Layout, CommonTextField, CommonDialog } from '@shared-lib';
import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Otp from '../otp/page';

const NewUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [otp, setOtp] = React.useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const sanitizedValue = value.trim();
      setFormData({
        ...formData,
        [field]: sanitizedValue,
      });
      setError({
        ...error,
        [field]:
          field === 'phoneNumber'
            ? !isValidPhoneNumber(sanitizedValue)
            : sanitizedValue === '',
      });
    };
  const handleButtonClick = () => {
    const isFormValid =
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      isValidPhoneNumber(formData.phoneNumber);

    if (isFormValid) {
      setIsDialogOpen(true);
    }
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      // Add API call for OTP verification
      // await verifyOtp(formData.phoneNumber, otp);
      handleDialogClose();
    } catch (error) {
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <Layout isFooter={false} showBack={true} sx={{ height: '100vh' }}>
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
        {' '}
        <Grid
          size={{ xs: 12, sm: 6, md: 6, lg: 5 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#444444',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h1"
            fontSize="18px"
            color="#1D1B20"
            fontWeight={500}
          >
            Placeholder Content
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 6, lg: 7 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: '20px 20px 0 0',
            padding: '15px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CommonTextField
            label="First name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            type="text"
            variant="outlined"
            helperText={error.firstName ? `Required first name ` : ''}
            error={error.firstName}
          />
          <CommonTextField
            label="Last name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            type="text"
            variant="outlined"
            helperText={error.lastName ? 'Required last name' : ''}
            error={error.lastName}
          />
          <CommonTextField
            label="Phone number"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            type="text"
            variant="outlined"
            helperText={error.phoneNumber ? 'Required phoen number' : ''}
            error={error.phoneNumber}
            supportingText="It will help us stay connected and share important updates"
          />
          <Button
            onClick={handleButtonClick}
            disabled={!isValidPhoneNumber(formData.phoneNumber)}
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
            Submit
          </Button>
          <Typography
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
            textAlign={'center'}
          >
            Already Applied? Login Here
          </Typography>
        </Grid>
      </Grid>

      <CommonDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        header="Verify Phone Number"
        content={
          <Grid container spacing={2}>
            <Typography>
              We’ve sent an OTP to verify your number {formData.phoneNumber}
            </Typography>

            <Otp
              separator={<span></span>}
              value={otp}
              onChange={setOtp}
              length={6}
            />
            {otpError && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginTop: '8px', textAlign: 'center' }}
              >
                {otpError}
              </Typography>
            )}
          </Grid>
        }
        actions={
          <Button
            onClick={handleOtpSubmit}
            disabled={isVerifying || otp.length !== 6}
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
            {isVerifying ? 'Verifying...' : 'Submit OTP'}
          </Button>
        }
      />
    </Layout>
  );
};
export default NewUser;
