// sonar-exclusion
import React, { useState, useEffect } from 'react';
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

import { createUser } from '../../service/content';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Loader from '../../component/layout/LoaderComponent';
import ImageCenter from '../../component/ImageCenter';

import { languageData } from '../../utils/constantData';
import Layout from '../../component/layout/layout';

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
  const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
  const [tenantCohortRoleMapping, setTenantCohortRoleMapping] = useState([
    {
      tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
      roleId: '',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // **Validation Functions**
  const validateName = (name: string) => {
    const hasNumbers = /\d/; // Regex to check if the name contains numbers
    if (hasNumbers.test(name)) {
      return false; // Name contains numbers
    }
    return name.trim().split(' ').length >= 2; // Check if the name has at least two words
  };

  const validateEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };
  const validateGender = (gender: string) => gender !== '';
  // **Handle Change**
  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowAlertMsg('');
      const value = event.target.value;
      const validateField = (field: string, value: string) => {
        switch (field) {
          case 'name':
            return !validateName(value);
          case 'email':
            return !validateEmail(value);
          case 'password':
            return !validatePassword(value);
          case 'gender':
            return !validateGender(value);
          default:
            return false;
        }
      };

      setFormData({ ...formData, [field]: value });
      setError({
        ...error,
        [field]: validateField(field, value),
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
    setLoading(true);
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
      } else if (response?.response?.data?.responseCode === 400) {
        setShowAlertMsg(response?.response?.data?.params?.err);
        setAlertSeverity('error');
        console.log('error', response?.response?.data?.params?.err);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const roleId = event.target.value;
    setSelectedValue(roleId);
    localStorage.setItem('role', roleId);
    // Update the roleId in tenantCohortRoleMapping
    setTenantCohortRoleMapping([
      {
        tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
        roleId: roleId,
      },
    ]);
  };
  const handleCloseUserDetailsDialog = () => {
    setOpenUserDetailsDialog(false);
    router.push('/signin');
  };
  useEffect(() => {
    if (showAlertMsg) {
      const timer = setTimeout(() => {
        setShowAlertMsg(''); // Hide the alert message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount or state change
    }
  }, [showAlertMsg]);
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
              {/* <ImageCenter /> */}
              <FormLabel component="legend" sx={{ color: '#4D4639' }}>
                Full Name<span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <CommonTextField
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/\d/.test(value)) {
                    // Allow only if the input doesn't contain numbers
                    handleChange('name')(
                      e as React.ChangeEvent<HTMLInputElement>
                    );
                  }
                }}
                type="text"
                variant="outlined"
                helperText={
                  error.name ? 'Enter full name (First and Last)' : ''
                }
                error={error.name}
              />

              <FormLabel component="legend" sx={{ color: '#4D4639' }}>
                Email ID<span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <CommonTextField
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;

                  // Prevent entering a number at the start
                  if (value.length === 1 && /^\d/.test(value)) return;

                  handleChange('email')(
                    e as React.ChangeEvent<HTMLInputElement>
                  );

                  // Validate email format
                  const isValidEmail =
                    /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value);

                  if (!isValidEmail) {
                    setError((prevError) => ({ ...prevError, email: true }));
                  } else {
                    setError((prevError) => ({ ...prevError, email: false }));
                  }
                }}
                type="text"
                variant="outlined"
                helperText={
                  error.email
                    ? 'Enter a valid Email ID (Should not start with a number)'
                    : ''
                }
                error={error.email}
              />

              <FormLabel component="legend" sx={{ color: '#4D4639' }}>
                Password<span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <CommonTextField
                value={formData.password}
                onChange={(e) => {
                  const value = e.target.value;
                  // @ts-ignore
                  handleChange('password')(
                    e as React.ChangeEvent<HTMLInputElement>
                  );

                  // Password validation regex
                  const passwordRegex = /^.{6,}$/;

                  // Update error state based on validation
                  if (!passwordRegex.test(value)) {
                    setError((prevError) => ({ ...prevError, password: true }));
                  } else {
                    setError((prevError) => ({
                      ...prevError,
                      password: false,
                    }));
                  }
                }}
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                helperText={
                  error.password
                    ? 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.'
                    : ''
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
              <FormLabel component="legend" sx={{ color: '#4D4639' }}>
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
                      sx={{
                        color: '#FFBD0D',
                        '&.Mui-checked': { color: '#FFBD0D' },
                      }}
                    />
                  }
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={
                    <Radio
                      sx={{
                        color: '#FFBD0D',
                        '&.Mui-checked': { color: '#FFBD0D' },
                      }}
                    />
                  }
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={
                    <Radio
                      sx={{
                        color: '#FFBD0D',
                        '&.Mui-checked': { color: '#FFBD0D' },
                      }}
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

              <FormLabel component="legend" sx={{ color: '#4D4639' }}>
                Select Role<span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <CommonSelect
                value={selectedValue}
                onChange={handleRoleChange}
                options={languageData.map(({ title, roleId }) => ({
                  label: title,
                  value: roleId,
                }))}
              />

              {/* {otpShow ? ( */}
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        sx={{
                          transform: 'scale(0.8)',
                          color: '#FFBD0D',
                          '&.Mui-checked': {
                            color: '#FFBD0D',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="14px" marginLeft="-2%">
                        I have read and accepted the{' '}
                        <Link
                          href="/termsandcondition"
                          style={{
                            color: '#0047D4',
                            textDecoration: 'underline',
                          }}
                        >
                          Terms and Conditions
                        </Link>
                        .
                      </Typography>
                    }
                  />
                </Box>

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
                    !formData.gender ||
                    !selectedValue ||
                    !languageData.some(
                      ({ roleId }) => roleId === selectedValue
                    ) ||
                    !termsAccepted
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
                  onClick={() => setShowAlertMsg('')}
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
              disableCloseOnBackdropClick={true}
              header="User Details"
              hideCloseButton={true}
              content={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body1">
                    <strong>Username:</strong> {formData.email.split('@')[0]}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Password:</strong> {formData.password}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Note:</strong> Please save your username and
                    password for future use.
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
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
