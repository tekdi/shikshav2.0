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
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  CommonDialog,
  CommonSelect,
  CommonTextField,
  languageData,
} from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createUser } from '../../service/content';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Loader from '../../component/layout/LoaderComponent';
import { trackEvent } from '@shared-lib';
import Layout from '../../component/layout/layout';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateMobile,
} from '../../utils/authUtils';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';

export default function Registration() {
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    name: '',
    email: '',
    mobile: '',
    password: '',
    gender: '',
  });

  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
    gender: false,
    mobile: false,
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

  const validateGender = (gender: string) => gender !== '';
  // **Handle Change**
  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const validateField = (field: string, value: string | number) => {
        if (typeof value !== 'string') return false; // Ensure value is a string
        switch (field) {
          case 'name':
            return !validateName(value);
          case 'email':
            return !validateEmail(value);
          case 'password':
            return !validatePassword(value);
          case 'gender':
            return !validateGender(value);
          case 'mobile':
            return value ? !validateMobile(value) : false;
          default:
            return false;
        }
      };

      setFormData({ ...formData, [field]: value });
      setError({
        ...error,
        [field]: validateField(field.toString(), value.toString()),
      });
    };

  const handleCreateUser = async () => {
    trackEvent({
      action: 'signup',
      category: 'engagement',
      label: 'user created successfully',
    });
    if (
      !validateName(formData.name) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateGender(formData.gender) ||
      (formData.mobile && !validateMobile(formData.mobile))
    ) {
      setError({
        name: !validateName(formData.name),
        email: !validateEmail(formData.email),
        password: !validatePassword(formData.password),
        gender: !validateGender(formData.gender),
        mobile: formData.mobile ? !validateMobile(formData.mobile) : false,
      });
      return;
    }
    setLoading(true);
    try {
      const [firstName, ...lastNameArr] = formData.name.trim().split(' ');
      const lastName = lastNameArr.join(' ');
      const username = formData.email;
      const payload = {
        firstName,
        lastName,
        username,
        password: formData.password,
        gender: formData.gender,
        ...(formData.mobile && { mobile: formData.mobile }),
        tenantCohortRoleMapping: tenantCohortRoleMapping,
      };
      const response = await createUser(payload);
      if (response?.responseCode === 201) {
        trackEvent({
          action: 'registration_success',
          category: 'user',
          label: 'Registration Form',
        });
        setShowAlertMsg('User registered successfully!');
        setAlertSeverity('success');
        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split('/')[0];

        const telemetryInteract = {
          context: {
            env: env,
            cdata: [],
          },
          edata: {
            id: 'user created successfully',
            type: TelemetryEventType.CLICK,
            subtype: '',
            pageid: cleanedUrl,
          },
        };
        telemetryFactory.interact(telemetryInteract);
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
  useEffect(() => {
    if (showAlertMsg) {
      const timer = setTimeout(() => {
        setShowAlertMsg(''); // Hide the alert message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount or state change
    }
  }, [showAlertMsg]);
  return (
    <Layout
      showTopAppBar={{
        title: ' Sign up to Engage, Educate, and Inspire.', // Add this
      }}
    >
      <Box>
        {loading ? (
          <Loader />
        ) : (
          <Paper
            elevation={6}
            sx={{
              maxWidth: 800,
              width: '100%',
              borderRadius: 4,
              overflow: 'hidden',
              mx: 'auto',
              mt: 6,
              p: { xs: 2, sm: 3 },
              bgcolor: '#ffffff',
              position: 'relative',
              boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.15)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                right: '-6px',
                bottom: '-6px',
                background: 'linear-gradient(90deg, #FFBD0D 0%, #fcb900 100%)',
                zIndex: -1,
                borderRadius: 'inherit',
                filter: 'blur(5px)',
              },
            }}
          >
            <Grid container direction="column" spacing={1.5}>
              {[
                {
                  key: 'name',
                  label: 'Full Name',
                  type: 'text',
                  required: true,
                },
                {
                  key: 'email',
                  label: 'Email ID',
                  type: 'text',
                  required: true,
                },
                {
                  key: 'mobile',
                  label: 'Contact Number',
                  type: 'text',
                  required: false,
                },
                {
                  key: 'password',
                  label: 'Password',
                  type: showPassword ? 'text' : 'password',
                  required: true,
                },
              ].map(({ key, label, type, required }) => (
                <Grid item key={key} container alignItems="center" spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <FormLabel
                      sx={{
                        color: '#000000',
                        fontWeight: 500,
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {label}
                      &nbsp;{' '}
                      {required && <span style={{ color: 'red' }}>*</span>}
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <CommonTextField
                      value={formData[key]}
                      onChange={handleChange(key)}
                      type={type}
                      variant="outlined"
                      fullWidth
                      error={error[key as keyof typeof error]}
                      helperText={
                        error[key as keyof typeof error]
                          ? `Please enter valid ${label.toLowerCase()}`
                          : ''
                      }
                      endIcon={
                        key === 'password' && (
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

              {/* Gender selection */}
              <Grid item container alignItems="center">
                <Grid item xs={12} sm={3}>
                  <FormLabel
                    sx={{
                      color: '#000000',
                      fontWeight: 500,
                      fontSize: '16px',
                      fontFamily: 'poppins',
                    }}
                  >
                    Gender &nbsp;<span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <RadioGroup
                    row
                    value={formData.gender}
                    onChange={handleChange('gender')}
                  >
                    {['male', 'female', 'other'].map((gender) => (
                      <FormControlLabel
                        key={gender}
                        value={gender}
                        control={
                          <Radio
                            sx={{
                              color: '#FFBD0D',
                              fontFamily: 'poppins',
                              fontSize: '16px',
                              fontWeight: 500,
                              '&.Mui-checked': { color: '#FFBD0D' },
                              p: 0.5,
                            }}
                          />
                        }
                        label={
                          <Typography fontSize="13px">
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                  {error.gender && (
                    <Typography color="error" fontSize="12px">
                      Please select a gender.
                    </Typography>
                  )}
                </Grid>
              </Grid>

              {/* Role Select */}
              <Grid item container alignItems="center">
                <Grid item xs={12} sm={3}>
                  <FormLabel
                    sx={{
                      color: '#000000',
                      fontFamily: 'poppins',
                      fontWeight: 500,
                      fontSize: '16px',
                    }}
                  >
                    Select Role &nbsp;<span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <CommonSelect
                    value={selectedValue}
                    onChange={handleRoleChange}
                    options={languageData.map(({ title, roleId }) => ({
                      label: title,
                      value: roleId,
                    }))}
                  />
                </Grid>
              </Grid>

              {/* Terms and Conditions */}
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      sx={{
                        transform: 'scale(0.9)',
                        color: '#fcd804',
                        '&.Mui-checked': { color: '#fcd804' },
                        p: 0.5,
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: 'poppins',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
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
                    </Typography>
                  }
                />
              </Grid>

              {/* Submit Button */}
              <Grid item textAlign="center">
                <Button
                  onClick={handleCreateUser}
                  sx={{
                    width: { xs: '100%', sm: '70%', md: '60%' },
                    height: '40px',
                    background: '#fcd804',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    color: '#000000',
                  }}
                  disabled={
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !formData.gender ||
                    // !formData.mobile ||
                    !selectedValue ||
                    !termsAccepted
                  }
                >
                  Verify & Proceed
                </Button>
                <Typography
                  textAlign="center"
                  fontSize="16px"
                  color="#000000"
                  fontWeight={500}
                >
                  Already have an Account?{' '}
                  <Link
                    href="/signin"
                    style={{ color: '#0037B9', textDecoration: 'underline' }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Grid>
            </Grid>
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
                sx={{
                  pointerEvents: 'auto',
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  zIndex: 9999,
                }}
                onClick={() => {
                  setShowAlertMsg('');
                  if (alertSeverity === 'success') {
                    router.push('/signin');
                  }
                }}
              >
                <Alert
                  variant="filled"
                  severity={alertSeverity}
                  sx={{
                    pointerEvents: 'auto',
                    width: 'auto',
                    minWidth: '300px',
                    '&:hover': {
                      cursor: 'default', // Prevent cursor change on hover
                    },
                  }}
                  onClose={() => {
                    setShowAlertMsg('');
                    if (alertSeverity === 'success') {
                      router.push('/signin');
                    }
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent click-through to overlay
                >
                  {showAlertMsg}
                </Alert>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Layout>
  );
}
