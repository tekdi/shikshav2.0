  'use client';
  import React, { useState, useEffect, useCallback } from 'react';
  import {
    Button,
    IconButton,
    Typography,
    Alert,
    Box,
    Paper,
    TextField,
    Divider,
  } from '@mui/material';
  import { CommonTextField } from '@shared-lib';
  import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
  import { useRouter } from 'next/navigation';
  import { getUserAuthInfo, signin } from '../../service/content';
  import Layout from '../../component/layout/layout';
  import LockOpenIcon from '@mui/icons-material/LockOpen';

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Helper functions
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Define types for the component props
  type EmailStepProps = {
    onNext: () => void;
    data: { email: string; registeredWithGoogle: boolean };
    errors: { email: string };
    onChange: (field: string, value: string) => void;
  };

  type OtpStepProps = {
    email: string;
    otp: string;
    otpTimer: number;
    onVerify: () => void;
    onResend: () => void;
    onOtpChange: (index: number, value: string) => void;
    onBack: () => void;
  };

  type NewPasswordStepProps = {
    data: { newPassword: string; confirmPassword: string };
    errors: { newPassword: string; confirmPassword: string };
    showPasswords: { newPassword: boolean; confirmPassword: boolean };
    onChange: (field: string, value: string) => void;
    onTogglePassword: (field: string) => void;
    onSubmit: () => void;
    onBack: () => void;
  };

  // Step Components
  const EmailStep = React.memo(
    ({ onNext, data, errors, onChange }: EmailStepProps) => (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <LockOpenIcon sx={{ fontSize: 40, color: 'black' }} />
        </Box>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mt: 2,
            mb: 3,
            fontWeight: 600,
            fontFamily: 'Poppins',
            fontSize: { xs: '16px', md: '18px' },
          }}
        >
          Forgot Password?
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 3,
            color: '#666',
            fontFamily: 'Poppins',
            fontSize: { xs: '14px', md: '16px' },
          }}
        >
          Enter the email address associated with your account.
        </Typography>

        <Box
          sx={{
            mb: 2,
            // Label color (unfocused & focused)
            '& .MuiInputLabel-root': {
              color: 'gray',
            },
            '& .Mui-focused .MuiInputLabel-root': {
              color: 'black',
            },
            // Border/underline color (focused)
            '& .MuiOutlinedInput-root': {
              // For 'outlined' variant
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
                color: 'black',
              },
            },
            '& .MuiInput-underline:after': {
              // For 'standard' variant
              borderBottomColor: 'black',
            },
            '& .MuiFilledInput-underline:after': {
              // For 'filled' variant
              borderBottomColor: 'black',
            },
          }}
        >
          <CommonTextField
            fullWidth
            type="email"
            label="Enter email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={onNext}
          disabled={data.registeredWithGoogle || !data.email}
          sx={{
            mt: 2,
            height: 48,
            borderRadius: '24px',
            backgroundColor: '#fcd804',
            color: '#000',
            fontWeight: 600,
            fontFamily: 'Poppins',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#e6c200' },
            '&:disabled': { backgroundColor: '#e0e0e0' },
          }}
        >
          Next
        </Button>
      </>
    )
  );

  const OtpStep = React.memo(
    ({
      email,
      otp,
      otpTimer,
      onVerify,
      onResend,
      onOtpChange,
      onBack,
    }: OtpStepProps) => {
      const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

      const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
          onOtpChange(index, value);
          // Move focus to next input if a digit was entered
          if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
          }
        }
      };

      const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
          // Move focus to previous input on backspace if current is empty
          inputRefs.current[index - 1]?.focus();
        }
      };

      const renderOtpInputs = () => {
        return (
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 }, // smaller gap on mobile
              justifyContent: 'center',
              mt: 2,
              width: '100%',
              maxWidth: '400px', // prevent too wide on large screens
              margin: '0 auto', // center the container
            }}
          >
            {Array(6)
              .fill('')
              .map((_, i) => (
                <TextField
                  key={i}
                  inputRef={(el) => (inputRefs.current[i] = el)}
                  value={otp[i] || ''}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputProps={{
                    maxLength: 1,
                    inputMode: 'numeric',
                    style: {
                      textAlign: 'center',
                      fontSize: { xs: '18px', sm: '20px' }, // smaller font on mobile
                      fontWeight: 'bold',
                      padding: 0, // remove default padding
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px',
                      height: { xs: '45px', sm: '50px' }, // slightly shorter on mobile
                      width: { xs: '35px', sm: '40px' }, // slightly narrower on mobile
                    },
                    '& .MuiInputBase-input': {
                      padding: 0, // remove default padding
                    },
                    '& .MuiInputLabel-root': {
                      color: 'gray',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: 'black',
                    },
                    // Border/underline color (focused)
                    '& .MuiOutlinedInput-root': {
                      // For 'outlined' variant
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black',
                      },
                    },
                    '& .MuiInput-underline:after': {
                      // For 'standard' variant
                      borderBottomColor: 'black',
                    },
                    '& .MuiFilledInput-underline:after': {
                      // For 'filled' variant
                      borderBottomColor: 'black',
                    },
                  }}
                />
              ))}
          </Box>
        );
      };

      return (
        <>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <IconButton onClick={onBack} sx={{ color: '#000' }}>
              <ArrowBack />
            </IconButton>
          </Box> */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LockOpenIcon sx={{ fontSize: 40, color: 'black' }} />
          </Box>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mt: 1,
              mb: 1,
              fontWeight: 600,
              fontFamily: 'Poppins',
              fontSize: { xs: '16px', md: '18px' },
            }}
          >
            Forgot Password?
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 3,
              color: '#666',
              fontFamily: 'Poppins',
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            Enter the 6-digit code sent to your email
          </Typography>

          <TextField
            fullWidth
            value={email}
            label="Enter email"
            disabled
            sx={{ mb: 3 }}
          />

          {renderOtpInputs()}

          <Typography variant="body2" align="center" sx={{ mt: 2, mb: 3 }}>
            {otpTimer > 0 ? (
              <>
                <span style={{textDecoration: 'underline'}}> Resend code in:</span>{' '}
                <strong>{formatTime(otpTimer)}</strong>
              </>
            ) : (
              <span
                style={{
                  color: '#1a73e8',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={onResend}
              >
                Resend Code
              </span>
            )}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={onVerify}
            disabled={otp.length < 6}
            sx={{
              height: 48,
              borderRadius: '24px',
              backgroundColor: '#fcd804',
              color: '#000',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#e6c200' },
              '&:disabled': { backgroundColor: '#e0e0e0' },
            }}
          >
            Verify & Proceed
          </Button>
        </>
      );
    }
  );

  const NewPasswordStep = React.memo(
    ({
      data,
      errors,
      showPasswords,
      onChange,
      onTogglePassword,
      onSubmit,
      onBack,
    }: NewPasswordStepProps) => {
      // Password validation function
      const isPasswordValid = (password: string) => {
        if (!password) return false;
        // At least 8 characters
        if (password.length < 8) return false;
        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) return false;
        // At least one lowercase letter
        if (!/[a-z]/.test(password)) return false;
        // At least one number
        if (!/[0-9]/.test(password)) return false;
        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        return true;
      };

      // Password regex for the submit button
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

      // Determine if we should show validation message for new password
      const showNewPasswordValidation =
        data.newPassword &&
        !isPasswordValid(data.newPassword) &&
        !errors.newPassword;

      // Determine if passwords mismatch
      const passwordsMismatch =
        data.confirmPassword && data.newPassword !== data.confirmPassword;

      return (
        <>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <IconButton onClick={onBack} sx={{ color: '#000' }}>
              <ArrowBack />
            </IconButton>
          </Box> */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LockOpenIcon sx={{ fontSize: 40, color: 'black' }} />
          </Box>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mt: 2,
              mb: 3,
              fontWeight: 600,
              fontFamily: 'Poppins',
              fontSize: { xs: '16px', md: '18px' },
            }}
          >
            Create a strong password
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 3,
              color: '#666',
              fontFamily: 'Poppins',
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            Create a new, strong password that you don't use for other websites
          </Typography>

          <CommonTextField
            fullWidth
            type={showPasswords.newPassword ? 'text' : 'password'}
            label="Enter Password"
            value={data.newPassword}
            onChange={(e) => onChange('newPassword', e.target.value)}
            error={!!errors.newPassword}
            helperText={
              errors.newPassword ||
              (showNewPasswordValidation
                ? 'Must contain at least 8 characters, including uppercase, lowercase, number, and special character'
                : '')
            }
            FormHelperTextProps={{
              sx: {
                color: errors.newPassword ? 'red' : 'red',
                visibility:
                  data.newPassword &&
                  (showNewPasswordValidation || errors.newPassword)
                    ? 'visible'
                    : 'hidden',
                height: data.newPassword ? 'auto' : '0',
                marginTop: data.newPassword ? '8px' : '0',
                transition: 'all 0.2s ease',
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => onTogglePassword('newPassword')}
                  edge="end"
                >
                  {showPasswords.newPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
            sx={{
              mb: 2,
              // Label color (unfocused & focused)
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .Mui-focused .MuiInputLabel-root': {
                color: 'black',
              },
              // Border/underline color (focused)
              '& .MuiOutlinedInput-root': {
                // For 'outlined' variant
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
              '& .MuiInput-underline:after': {
                // For 'standard' variant
                borderBottomColor: 'black',
              },
              '& .MuiFilledInput-underline:after': {
                // For 'filled' variant
                borderBottomColor: 'black',
              },
            }}
          />

          <CommonTextField
            fullWidth
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            value={data.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            error={!!errors.confirmPassword || passwordsMismatch}
            helperText={
              errors.confirmPassword ||
              (passwordsMismatch ? "Passwords don't match" : '')
            }
            FormHelperTextProps={{
              sx: {
                color: '#f44336',
                visibility:
                  data.confirmPassword &&
                  (passwordsMismatch || errors.confirmPassword)
                    ? 'visible'
                    : 'hidden',
                height: data.confirmPassword ? 'auto' : '0',
                marginTop: data.confirmPassword ? '8px' : '0',
                transition: 'all 0.2s ease',
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => onTogglePassword('confirmPassword')}
                  edge="end"
                >
                  {showPasswords.confirmPassword ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              ),
            }}
            sx={{
              mb: 2,
              // Label color (unfocused & focused)
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .Mui-focused .MuiInputLabel-root': {
                color: 'black',
              },
              // Border/underline color (focused)
              '& .MuiOutlinedInput-root': {
                // For 'outlined' variant
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
              '& .MuiInput-underline:after': {
                // For 'standard' variant
                borderBottomColor: 'black',
              },
              '& .MuiFilledInput-underline:after': {
                // For 'filled' variant
                borderBottomColor: 'black',
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            disabled={
              !data.newPassword ||
              !data.confirmPassword ||
              passwordsMismatch ||
              !isPasswordValid(data.newPassword)
            }
            sx={{
              height: 48,
              borderRadius: '24px',
              backgroundColor: '#fcd804',
              color: '#000',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#e6c200' },
              '&:disabled': { backgroundColor: '#e0e0e0' },
            }}
          >
            Reset Password
          </Button>
        </>
      );
    }
  );

  type ForgotPasswordState = {
    forgotData: {
      email: string;
      newPassword: string;
      confirmPassword: string;
      registeredWithGoogle: boolean;
    };
    forgotErrors: {
      email: string;
      newPassword: string;
      confirmPassword: string;
    };
    showPasswords: {
      newPassword: boolean;
      confirmPassword: boolean;
    };
    otp: string;
    otpHash: string;
    otpTimer: number;
    currentStep: 'email' | 'otp' | 'newPassword';
    alert: {
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
    };
  };

  const ForgotPasswords = () => {
    const router = useRouter();
    const [state, setState] = useState<ForgotPasswordState>({
      forgotData: {
        email: '',
        newPassword: '',
        confirmPassword: '',
        registeredWithGoogle: false,
      },
      forgotErrors: {
        email: '',
        newPassword: '',
        confirmPassword: '',
      },
      showPasswords: {
        newPassword: false,
        confirmPassword: false,
      },
      otp: '',
      otpHash: '',
      otpTimer: 600,
      currentStep: 'email',
      alert: {
        message: '',
        severity: 'success',
      },
    });

    const handleSendOtp = useCallback(async () => {
      const { email } = state.forgotData;

      if (!validateEmail(email)) {
        setState((prev) => ({
          ...prev,
          forgotErrors: { ...prev.forgotErrors, email: 'Enter a valid email.' },
        }));
        return;
      }

      try {
        const response = await fetch(
          'https://shiksha-dev-interface.tekdinext.com/interface/v1/user/send-otp',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              reason: 'forgot',
              key: 'SendOtpOn',
              replacements: {
                '{eventName}': 'ATREE OTP',
                '{programName}': 'ATREE',
              },
            }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          setState((prev) => ({
            ...prev,
            otpHash: result?.result?.data?.hash || '',
            currentStep: 'otp',
            otpTimer: 600,
            forgotErrors: { ...prev.forgotErrors, email: '' },
          }));
        } else {
          setState((prev) => ({
            ...prev,
            alert: {
              message: result?.params?.errmsg || 'Failed to send OTP',
              severity: 'error',
            },
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          alert: { message: 'An error occurred.', severity: 'error' },
        }));
      }
    }, [state.forgotData.email]);

    const verifyOtp = useCallback(async () => {
      try {
        const response = await fetch(
          'https://shiksha-dev-interface.tekdinext.com/interface/v1/user/verify-otp',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              username: state.forgotData.email,
              email: state.forgotData.email,
              reason: 'forgot',
              otp: state.otp,
              hash: state.otpHash,
            }),
          }
        );

        const data = await response.json();
        if (response.ok && data.result?.token) {
          setState((prev) => ({
            ...prev,
            otpHash: data.result.token,
            currentStep: 'newPassword',
          }));
        } else {
          setState((prev) => ({
            ...prev,
            alert: {
              message: data?.params?.err || 'Invalid OTP.',
              severity: 'error',
            },
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          alert: {
            message: 'An error occurred while verifying OTP.',
            severity: 'error',
          },
        }));
      }
    }, [state.forgotData.email, state.otp, state.otpHash]);

    const resetPassword = useCallback(async () => {
      const { newPassword, confirmPassword, email } = state.forgotData;
      const newErrors = {
        email: '',
        newPassword: '',
        confirmPassword: '',
      };

      // Validate new password
      if (!newPassword) {
        newErrors.newPassword = 'Password is required';
      } else if (!passwordRegex.test(newPassword)) {
        newErrors.newPassword =
          'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
      }

      // Validate confirm password
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setState((prev) => ({
        ...prev,
        forgotErrors: newErrors,
      }));

      // If there are any errors, stop here
      if (Object.values(newErrors).some((error) => error)) {
        return;
      }

      try {
        const response = await fetch(
          'https://shiksha-dev-interface.tekdinext.com/interface/v1/user/forgot-password',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              newPassword: state.forgotData.newPassword,
              token: state.otpHash,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Now login the user automatically
          try {
            const loginResponse = await signin({
              email: state.forgotData.email,
              password: state.forgotData.newPassword,
            });

            if (loginResponse?.result?.access_token) {
              localStorage.setItem('token', loginResponse.result.access_token);
              localStorage.setItem(
                'refreshToken',
                loginResponse.result.refresh_token
              );

              const authInfo = await getUserAuthInfo({
                token: loginResponse.result.access_token,
              });

              if (authInfo?.result?.status !== 'archived') {
                const capitalizeFirstLetter = (word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1);
                const user = `${capitalizeFirstLetter(
                  authInfo?.result?.firstName
                )} ${capitalizeFirstLetter(authInfo?.result?.lastName)}`.trim();

                localStorage.setItem('username', user);
                localStorage.setItem('userId', authInfo?.result?.userId);
                localStorage.setItem(
                  'role',
                  authInfo?.result?.tenantData?.[0]?.roleName
                );

                // dispatchLoginEvent(user, 'credentials');
                setState((prev) => ({
                  ...prev,
                  alert: {
                    message: 'Password reset and login successful!',
                    severity: 'success',
                  },
                }));

                // Track events and telemetry as before
                // trackEvent({
                //   action: 'signin',
                //   category: 'engagement',
                //   label: `Login successful - ${
                //     authInfo?.result?.userId || 'Anonymous'
                //   }`,
                // });

                const windowUrl = window.location.pathname;
                const cleanedUrl = windowUrl.replace(/^\//, '');
                const env = cleanedUrl.split('/')[0];

                // const telemetryInteract = {
                //   context: {
                //     env: env,
                //     cdata: [],
                //   },
                //   edata: {
                //     id: 'Login successful',
                //     type: TelemetryEventType.CLICK,
                //     subtype: '',
                //     pageid: cleanedUrl,
                //     uid: authInfo?.result?.userId || 'Anonymous',
                //   },
                // };
                // telemetryFactory.interact(telemetryInteract);

                router.push('/');
              } else {
                setState((prev) => ({
                  ...prev,
                  alert: {
                    message: 'Your account has been deleted.',
                    severity: 'error',
                  },
                }));
              }
            } else {
              setState((prev) => ({
                ...prev,
                alert: {
                  message:
                    loginResponse?.response?.data?.params?.errmsg ||
                    'Login failed after password reset',
                  severity: 'error',
                },
              }));
            }
          } catch (loginError) {
            setState((prev) => ({
              ...prev,
              alert: {
                message:
                  'Password reset successful but login failed. Please try logging in manually.',
                severity: 'warning',
              },
            }));
          }

          // Close all dialogs
          setState((prev) => ({
            ...prev,
            openOtpDialog: false,
            openForgotDialog: false,
            forgotStep: 'email',
          }));
        } else {
          setState((prev) => ({
            ...prev,
            alert: {
              message: data?.params?.errmsg || 'Password reset failed.',
              severity: 'error',
            },
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          alert: {
            message: 'An error occurred while resetting password.',
            severity: 'error',
          },
        }));
      }
    }, [state.forgotData, state.otpHash, router, signin, getUserAuthInfo]);

    const handleOtpChange = useCallback((index: number, value: string) => {
      setState((prev) => {
        const otpArray = prev.otp.split('');
        otpArray[index] = value;
        const newOtp = otpArray.join('').substring(0, 6);

        return {
          ...prev,
          otp: newOtp,
        };
      });
    }, []);

    const togglePasswordVisibility = useCallback(
      (field: 'newPassword' | 'confirmPassword') => {
        setState((prev) => ({
          ...prev,
          showPasswords: {
            ...prev.showPasswords,
            [field]: !prev.showPasswords[field],
          },
        }));
      },
      []
    );

    const handleFieldChange = useCallback(
      (field: keyof typeof state.forgotData, value: string) => {
        setState((prev) => ({
          ...prev,
          forgotData: {
            ...prev.forgotData,
            [field]: value,
          },
          forgotErrors: {
            ...prev.forgotErrors,
            [field]: '', // Clear error when user types
          },
        }));
      },
      []
    );

    // OTP timer effect
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (state.currentStep === 'otp' && state.otpTimer > 0) {
        interval = setInterval(() => {
          setState((prev) => ({
            ...prev,
            otpTimer: prev.otpTimer - 1,
          }));
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [state.currentStep, state.otpTimer]);

    // Auto-dismiss alerts
    useEffect(() => {
      if (state.alert.message) {
        const timer = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            alert: { ...prev.alert, message: '' },
          }));
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [state.alert]);

    const renderCurrentStep = () => {
      switch (state.currentStep) {
        case 'email':
          return (
            <EmailStep
              onNext={handleSendOtp}
              data={state.forgotData}
              errors={state.forgotErrors}
              onChange={
                handleFieldChange as (field: string, value: string) => void
              }
            />
          );
        case 'otp':
          return (
            <OtpStep
              email={state.forgotData.email}
              otp={state.otp}
              otpTimer={state.otpTimer}
              onVerify={verifyOtp}
              onResend={handleSendOtp}
              onOtpChange={handleOtpChange}
              onBack={() =>
                setState((prev) => ({
                  ...prev,
                  currentStep: 'email',
                }))
              }
            />
          );
        case 'newPassword':
          return (
            <NewPasswordStep
              data={{
                newPassword: state.forgotData.newPassword,
                confirmPassword: state.forgotData.confirmPassword,
              }}
              errors={state.forgotErrors}
              showPasswords={state.showPasswords}
              onChange={
                handleFieldChange as (field: string, value: string) => void
              }
              onTogglePassword={
                togglePasswordVisibility as (field: string) => void
              }
              onSubmit={resetPassword}
              onBack={() =>
                setState((prev) => ({
                  ...prev,
                  currentStep: 'otp',
                }))
              }
            />
          );
        default:
          const _exhaustiveCheck: never = state.currentStep;
          return _exhaustiveCheck;
      }
    };

    return (
      <Layout showTopAppBar>
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              maxWidth: 500,
              borderRadius: 3,
              p: 3,
              mt: 6,
              bgcolor: '#ffffff',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            {renderCurrentStep()}

            {state.currentStep !== 'newPassword' && ( // Only show when not on password step
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: '#0E28AE',
                    cursor: 'pointer',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => router.push('/signin')}
                >
                  Back to Login
                </Typography>
              </>
            )}
          </Paper>
        </Box>

        {state.alert.message && (
          <Box
            sx={{
              position: 'fixed',
              top: 20,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Alert
              severity={state.alert.severity}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  alert: { ...prev.alert, message: '' },
                }))
              }
              sx={{ width: '100%', maxWidth: 500 }}
            >
              {state.alert.message}
            </Alert>
          </Box>
        )}
      </Layout>
    );
  };

  export default ForgotPasswords;
