import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Typography,
  RadioGroup,
  Radio,
  Alert,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommonDialog, CommonSelect, CommonTextField } from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// import Otp from './otp';
import { createUser } from '../services/LoginService';
// import TermsAndCondition from './components/TermsAndCondition';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

const languageData = [
  {
    id: 1,
    name: 'Educator',
    tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
    roleId: 'd5f1abf9-dd0f-43a4-aba3-3f1b70c5d425',
  },
  {
    id: 2,
    name: 'Mentor',
    tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
    roleId: 'd5f1abf9-dd0f-43a4-aba3-3f1b70c5d425',
  },
  {
    id: 3,
    name: 'Student',
    tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
    roleId: 'd5f1abf9-dd0f-43a4-aba3-3f1b70c5d425',
  },
];

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
  });

  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
    gender: false,
  });

  const [selectedValue, setSelectedValue] = useState('Educator');
  const [showAlertMsg, setShowAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
  const [tenantCohortRoleMapping, setTenantCohortRoleMapping] = useState([
    {
      tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
      roleId: '',
    },
  ]);
  const router = useRouter();

  // **Validation Functions**
  const validateName = (name: string) => {
    return name.trim().split(' ').length >= 2;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => password.length >= 6;
  const validateGender = (gender: string) => gender !== '';
  // **Handle Change**
  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowAlertMsg('');
      const value = event.target.value;
      setFormData({ ...formData, [field]: value });
      setError({
        ...error,
        [field]:
          field === 'name'
            ? !validateName(value)
            : field === 'email'
            ? !validateEmail(value)
            : field === 'password'
            ? !validatePassword(value)
            : field === 'gender'
            ? !validateGender(value)
            : false,
      });
    };

  const handleCreateUser = async () => {
    if (
      !validateName(formData.name) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateGender(formData.gender)
    ) {
      setError({
        name: !validateName(formData.name),
        email: !validateEmail(formData.email),
        password: !validatePassword(formData.password),
        gender: !validateGender(formData.gender),
      });
      return;
    }
    try {
      const [firstName, ...lastNameArr] = formData.name.trim().split(' ');
      const lastName = lastNameArr.join(' ');
      const username = formData.email.split('@')[0];
      const payload = {
        firstName,
        lastName,
        username,
        password: formData.password,
        gender: formData.gender,
        tenantCohortRoleMapping: tenantCohortRoleMapping,
      };
      const response = await createUser(payload);
      if (response?.responseCode === 201) {
        setShowAlertMsg('User registered successfully!');
        setAlertSeverity('success');
        setOpenUserDetailsDialog(true);
        // router.push('/signin');
      } else if (response?.response?.data?.responseCode === 400) {
        setShowAlertMsg(response?.response?.data?.params?.err);
        setAlertSeverity('error');
        console.log('error', response?.response?.data?.params?.err);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const roleId = event.target.value;
    setSelectedValue(roleId);

    // Update the roleId in tenantCohortRoleMapping
    setTenantCohortRoleMapping([
      {
        tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
        roleId: 'd5f1abf9-dd0f-43a4-aba3-3f1b70c5d425',
      },
    ]);
  };
  const handleCloseUserDetailsDialog = () => {
    setOpenUserDetailsDialog(false);
    router.push('/signin');
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
        <FormLabel component="legend">
          Full Name<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <CommonTextField
          value={formData.name}
          onChange={handleChange('name')}
          type="text"
          variant="outlined"
          helperText={error.name ? 'Enter full name (First and Last)' : ''}
          error={error.name}
        />

        <FormLabel component="legend">
          Email ID<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <CommonTextField
          value={formData.email}
          onChange={handleChange('email')}
          type="text"
          variant="outlined"
          helperText={error.email ? 'Enter a valid Email ID' : ''}
          error={error.email}
        />
        <FormLabel component="legend">
          Password<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <CommonTextField
          value={formData.password}
          onChange={handleChange('password')}
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          helperText={
            error.password ? 'Password must be at least 6 characters' : ''
          }
          error={error.password}
          endIcon={
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          }
        />
        <FormLabel component="legend">
          Gender<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <RadioGroup
          row
          value={formData.gender}
          onChange={handleChange('gender')}
        >
          <FormControlLabel
            value="male"
            control={
              <Radio
                sx={{ color: '#FFBD0D', '&.Mui-checked': { color: '#FFBD0D' } }}
              />
            }
            label="Male"
          />
          <FormControlLabel
            value="female"
            control={
              <Radio
                sx={{ color: '#FFBD0D', '&.Mui-checked': { color: '#FFBD0D' } }}
              />
            }
            label="Female"
          />
          <FormControlLabel
            value="other"
            control={
              <Radio
                sx={{ color: '#FFBD0D', '&.Mui-checked': { color: '#FFBD0D' } }}
              />
            }
            label="Other"
          />
        </RadioGroup>
        {error.gender && (
          <Typography color="error" fontSize="12px">
            Please select a gender.
          </Typography>
        )}
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

        <FormLabel component="legend">
          Select Role<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <CommonSelect
          value={selectedValue}
          onChange={handleRoleChange}
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
                onChange={() => setTermsAccepted(!termsAccepted)}
                sx={{
                  color: '#FFBD0D',
                  '&.Mui-checked': {
                    color: '#FFBD0D',
                  },
                }}
              />
            }
            label={
              <Typography fontSize="14px">
                I have read and accepted the{' '}
                <Link
                  href="/termsandcondition"
                  // onClick={() => router.push('/termsandcondition')}
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
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.gender
            }
          >
            Verify & Proceed
          </Button>
        </>
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

        {/* <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <GoogleLogin
            onSuccess={() => {}}
            onError={() => {}}
            useOneTap
            theme="outline"
          />
        </GoogleOAuthProvider> */}

        <Typography
          textAlign="center"
          fontSize="16px"
          color="#3B383E"
          fontWeight={500}
        >
          Already have an Account?{' '}
          <Link href="/signin" style={{ color: '#0037B9' }}>
            Sign In
          </Link>
        </Typography>
      </Grid>
      <CommonDialog
        isOpen={openUserDetailsDialog}
        onClose={() => setOpenUserDetailsDialog(false)}
        header="User Details"
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              <strong>Username:</strong> {formData.email.split('@')[0]}
            </Typography>
            <Typography variant="body1">
              <strong>Password:</strong> {formData.password}
            </Typography>
            <Typography variant="body1">
              <strong>Note:</strong> Please save your username and password for
              future use.
            </Typography>
          </Box>
        }
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleCloseUserDetailsDialog}
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
              OK
            </Button>
          </Box>
        }
        sx={{
          width: '500px',
          height: '300px',
          padding: '10px',
          borderRadius: '16px',
        }}
      />

      {/* <CommonDialog
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
      /> */}
    </Grid>
  );
}
