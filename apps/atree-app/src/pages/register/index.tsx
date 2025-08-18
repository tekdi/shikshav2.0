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
import { LANGUAGE_KEYS } from '../../utils/language.constants';
import { useAppTranslation } from '../../utils/i18n.helper';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type TranslationKey = keyof typeof LANGUAGE_KEYS;

// Define form fields outside the component
const getFormFields = (
  mounted: boolean,
  showPassword: boolean,
  t: (key: TranslationKey) => string
) => [
  {
    key: 'name',
    label: mounted ? t(LANGUAGE_KEYS.FULL_NAME) : LANGUAGE_KEYS.FULL_NAME,
    type: 'text',
    required: true,
  },
  {
    key: 'email',
    label: mounted ? t(LANGUAGE_KEYS.EMAIL_ID) : LANGUAGE_KEYS.EMAIL_ID,
    type: 'text',
    required: true,
  },
  {
    key: 'mobile',
    label: mounted
      ? t(LANGUAGE_KEYS.MOBILE_NUMBER)
      : LANGUAGE_KEYS.MOBILE_NUMBER,
    type: 'text',
    required: false,
  },
  {
    key: 'password',
    label: mounted ? t(LANGUAGE_KEYS.PASSWORD) : LANGUAGE_KEYS.PASSWORD,
    type: showPassword ? 'text' : 'password',
    required: true,
  },
];

export default function Registration() {
  // State hooks - always declare these first and unconditionally
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
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Hooks for router and translation - always call these
  const router = useRouter();
  const { t, ready } = useAppTranslation();

  // Effect hooks - always call these unconditionally
  useEffect(() => {
    setMounted(true);
    if (ready) {
      setIsReady(true);
    }
  }, [ready]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlertMsg) {
      timer = setTimeout(() => {
        setShowAlertMsg('');
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showAlertMsg]);

  // Validation and change handlers
  const validateGender = (gender: string) => gender !== '';

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const validateField = (field: string, value: string | number) => {
        if (typeof value !== 'string') return false;
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
      let gender = formData.gender;
      if (gender === 'other') {
        gender = 'transgender';
      }
      const payload = {
        firstName,
        lastName,
        username,
        password: formData.password,
        gender: gender,
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
        setShowAlertMsg(t(LANGUAGE_KEYS.REGISTRATION_SUCCESS));
        setAlertSeverity('success');
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
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
      setShowAlertMsg(t(LANGUAGE_KEYS.ERROR_OCCURRED));
      setAlertSeverity('error');
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

  // Early return for loading state
  if (!isReady || loading) {
    return <Loader />;
  }

  // Get form fields with current state
  const formFields = getFormFields(mounted, showPassword, t);

  // Render component
  return (
    <Layout showTopAppBar>
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
              mt: { xs: 2, sm: 6 },
              p: { xs: 2, sm: 3 },
              bgcolor: '#ffffff',
              position: 'relative',
              boxShadow: {
                xs: 'none', // No shadow on mobile
                sm: '0px 8px 24px rgba(0, 0, 0, 0.2)', // Shadow from sm and up
              },
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
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: { xs: '22px !important', sm: '24px !important' },
                color: '#000000',
                fontFamily: 'Poppins',
                textAlign: 'center',
              }}
            >
              {mounted ? t(LANGUAGE_KEYS.REGISTER) : LANGUAGE_KEYS.REGISTER}
            </Typography>
            <Grid container direction="column" spacing={1.5}>
              {formFields.map(({ key, label, type, required }) => (
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
                        key === 'password' && error.password
                          ? mounted
                            ? t(LANGUAGE_KEYS.PASSWORD_REQUIREMENTS)
                            : LANGUAGE_KEYS.PASSWORD_REQUIREMENTS
                          : error[key as keyof typeof error]
                          ? mounted
                            ? t(
                                key === 'name'
                                  ? LANGUAGE_KEYS.INVALID_NAME
                                  : key === 'email'
                                  ? LANGUAGE_KEYS.INVALID_EMAIL
                                  : key === 'mobile'
                                  ? LANGUAGE_KEYS.INVALID_MOBILE
                                  : LANGUAGE_KEYS.REQUIRED_FIELD
                              )
                            : LANGUAGE_KEYS.REQUIRED_FIELD
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
                    {mounted ? t(LANGUAGE_KEYS.GENDER) : LANGUAGE_KEYS.GENDER}{' '}
                    &nbsp;
                    <span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <RadioGroup
                    row
                    value={formData.gender}
                    onChange={handleChange('gender')}
                  >
                    {[
                      { value: 'male', label: LANGUAGE_KEYS.MALE },
                      { value: 'female', label: LANGUAGE_KEYS.FEMALE },
                      { value: 'other', label: LANGUAGE_KEYS.OTHER },
                    ].map(({ value, label }) => (
                      <FormControlLabel
                        key={value}
                        value={value}
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
                            {mounted ? t(label) : label}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                  {error.gender && (
                    <Typography color="error" fontSize="12px">
                      {mounted
                        ? t(LANGUAGE_KEYS.SELECT_GENDER)
                        : LANGUAGE_KEYS.SELECT_GENDER}
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
                    {mounted
                      ? t(LANGUAGE_KEYS.SELECT_ROLE)
                      : LANGUAGE_KEYS.SELECT_ROLE}{' '}
                    &nbsp;
                    <span style={{ color: 'red' }}>*</span>
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
                      {mounted
                        ? t(LANGUAGE_KEYS.ACCEPT_TERMS)
                        : LANGUAGE_KEYS.ACCEPT_TERMS}{' '}
                      <Link
                        href="/termsandcondition"
                        style={{
                          color: '#0047D4',
                          textDecoration: 'underline',
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {mounted
                          ? t(LANGUAGE_KEYS.TERMS_AND_CONDITIONS)
                          : LANGUAGE_KEYS.TERMS_AND_CONDITIONS}
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
                    width: { xs: '100%', sm: '60%', md: '50%' },
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
                  {mounted
                    ? t(LANGUAGE_KEYS.VERIFY_PROCEED)
                    : LANGUAGE_KEYS.VERIFY_PROCEED}
                </Button>
                <Typography
                  textAlign="center"
                  fontSize="16px"
                  color="#000000"
                  fontWeight={500}
                >
                  {mounted
                    ? t(LANGUAGE_KEYS.ALREADY_HAVE_ACCOUNT)
                    : LANGUAGE_KEYS.ALREADY_HAVE_ACCOUNT}{' '}
                  <Link
                    href="/signin"
                    style={{ color: '#0037B9', textDecoration: 'underline' }}
                  >
                    {mounted ? t(LANGUAGE_KEYS.SIGN_IN) : LANGUAGE_KEYS.SIGN_IN}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            {showAlertMsg && (
              <Box
                display="flex"
                justifyContent="center" // This centers horizontally
                alignItems="flex-start" // This aligns to the top vertically
                position="fixed"
                top={0}
                left={0}
                width="100vw"
                height="100vh"
                sx={{
                  pointerEvents: 'auto',
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  zIndex: 9999,
                  pt: 2, // Add some padding at the top (optional)
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
                      cursor: 'default',
                    },
                  }}
                  onClose={() => {
                    setShowAlertMsg('');
                    if (alertSeverity === 'success') {
                      router.push('/signin');
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
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

export async function getServerSideProps(context: { locale?: string }) {
  const { locale = 'en' } = context;

  const translations = await serverSideTranslations(locale, ['common'], null, [
    'REGISTRATION',
  ]);

  // Ensure translations object has the required properties
  if (
    !translations._nextI18Next?.initialI18nStore ||
    !translations._nextI18Next?.initialLocale
  ) {
    throw new Error('Failed to load translations');
  }

  return {
    props: {
      _nextI18Next: {
        initialI18nStore: translations._nextI18Next.initialI18nStore,
        initialLocale: translations._nextI18Next.initialLocale,
      },
    },
  };
}
