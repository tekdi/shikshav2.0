'use client';
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Button,
  IconButton,
  Typography,
  Alert,
  Box,
  Paper,
  TextField as MuiTextField,
  Divider,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { Theme } from '@mui/material/styles';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getUserAuthInfo, signin } from '../../service/content';
import Layout from '../../component/layout/layout';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper functions
const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};

const validateEmail = (email: string) => {
  return emailRegex.test(email);
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
  otpAttempts: number;
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

// Custom TextField with password toggle
type CustomTextFieldProps = TextFieldProps & {
  fullWidth?: boolean;
  type?: string;
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  sx?: any;
};

const CustomTextField = React.forwardRef<HTMLDivElement, CustomTextFieldProps>(
  ({ showPassword, onTogglePassword, type, error = false, ...props }, ref) => {
    const isPasswordType = props.label?.toLowerCase().includes('password');

    return (
      <MuiTextField
        {...props}
        ref={ref}
        type={type}
        error={error}
        InputProps={{
          ...props.InputProps,
          endAdornment: isPasswordType && (
            <InputAdornment position="end">
              <IconButton
                onClick={onTogglePassword}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }
);

CustomTextField.displayName = 'CustomTextField';

// Step Components
const EmailStep = React.memo(
  ({ onNext, data, errors, onChange }: EmailStepProps) => {
    const [localTouched, setLocalTouched] = useState(false);
    const [clicked, setClicked] = useState(false);
    useEffect(() => {
      setClicked(false);
    }, [data.email]);
    const showEmailValidation =
      localTouched && data.email && !validateEmail(data.email);

    const handleClick = () => {
      setClicked(true);
      onNext();
    };

    return (
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

        <Box sx={{ mb: 2 }}>
          <CustomTextField
            fullWidth
            type="email"
            label="Enter email"
            value={data.email}
            onChange={(e) => {
              onChange('email', e.target.value);
            }}
            onBlur={() => setLocalTouched(true)}
            error={!!errors.email || !!showEmailValidation}
            helperText={errors.email}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .Mui-focused .MuiInputLabel-root': {
                color: (theme: Theme) =>
                  theme.palette.mode === 'light' ? 'black' : 'white',
              },
              '& .Mui-error.MuiInputLabel-root': {
                color: 'gray',
              },
              '& .Mui-focused .Mui-error.MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'red',
                },
              },
            }}
          />
          {showEmailValidation && !errors.email && (
            <FormHelperText
              sx={{
                color: 'red',
                mt: 1,
                ml: 1,
              }}
            >
              Please enter a valid email address.
            </FormHelperText>
          )}
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={handleClick}
          disabled={
            clicked ||
            data.registeredWithGoogle ||
            !data.email ||
            !validateEmail(data.email)
          }
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
    );
  }
);

const OtpStep = React.memo(
  ({
    email,
    otp,
    otpTimer,
    onVerify,
    onResend,
    onOtpChange,
    otpAttempts,
    onBack,
  }: OtpStepProps & { otpAttempts: number }) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [resendTimer, setResendTimer] = useState(600);

    useEffect(() => {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const handleResendClick = () => {
      onResend();
      setResendDisabled(true);
      setResendTimer(600);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const handleChange = (index: number, value: string) => {
      if (/^\d?$/.test(value)) {
        onOtpChange(index, value);
        if (value && index < 5 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text/plain').trim();
      const otpDigits = pasteData.replace(/\D/g, '').split('').slice(0, 6);

      if (otpDigits.length === 6) {
        otpDigits.forEach((digit, index) => {
          onOtpChange(index, digit);
        });
        inputRefs.current[5]?.focus();
      }
    };

    const renderOtpInputs = () => {
      return (
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            justifyContent: 'center',
            mt: 2,
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
          }}
          onPaste={handlePaste}
        >
          {Array(6)
            .fill('')
            .map((_, i) => (
              <MuiTextField
                key={i}
                inputRef={(el) => (inputRefs.current[i] = el)}
                value={otp[i] || ''}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                inputProps={{
                  maxLength: 1,
                  inputMode: 'numeric',
                  style: {
                    textAlign: 'center',
                    fontWeight: 'bold',
                    padding: 0,
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    height: { xs: '45px', sm: '50px' },
                    width: { xs: '35px', sm: '40px' },
                  },
                  '& .MuiInputBase-input': {
                    padding: 0,
                    fontSize: { xs: '18px', sm: '20px' },
                    fontWeight: 'bold',
                    textAlign: 'center',
                  },
                }}
              />
            ))}
        </Box>
      );
    };

    return (
      <>
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

        <MuiTextField
          fullWidth
          value={email}
          label="Enter email"
          disabled
          sx={{ mb: 3 }}
        />

        {renderOtpInputs()}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            variant="text"
            onClick={handleResendClick}
            disabled={resendDisabled || otpAttempts >= 3}
            sx={{
              color:
                resendDisabled || otpAttempts >= 3
                  ? 'text.disabled'
                  : '#0E28AE',
              textDecoration: 'underline',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            {resendDisabled
              ? `Resend code in: ${formatTime(resendTimer)}`
              : otpAttempts < 3
              ? 'Resend Code'
              : 'Maximum attempts reached'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mb: 1 }}>
          Attempts remaining: {3 - otpAttempts}
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
    const isPasswordValid = (password: string) => {
      if (!password) return false;
      if (password.length < 8) return false;
      if (!/[A-Z]/.test(password)) return false;
      if (!/[a-z]/.test(password)) return false;
      if (!/[0-9]/.test(password)) return false;
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
      return true;
    };

    const showNewPasswordValidation =
      data.newPassword &&
      !isPasswordValid(data.newPassword) &&
      !errors.newPassword;

    const passwordsMismatch =
      data.confirmPassword && data.newPassword !== data.confirmPassword;

    return (
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

        <Box sx={{ mb: 2 }}>
          <CustomTextField
            fullWidth
            type={showPasswords.newPassword ? 'text' : 'password'}
            label="Enter Password"
            value={data.newPassword}
            onChange={(e) => onChange('newPassword', e.target.value)}
            error={!!errors.newPassword || Boolean(showNewPasswordValidation)}
            helperText={errors.newPassword}
            showPassword={showPasswords.newPassword}
            onTogglePassword={() => onTogglePassword('newPassword')}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .Mui-focused .MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
            }}
          />
          {showNewPasswordValidation && !errors.newPassword && (
            <FormHelperText
              sx={{
                color: 'red',
                mt: 1,
                ml: 1,
              }}
            >
              Must contain at least 8 characters, including uppercase,
              lowercase, number, and special character
            </FormHelperText>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <CustomTextField
            fullWidth
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            value={data.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            error={!!errors.confirmPassword || Boolean(passwordsMismatch)}
            helperText={errors.confirmPassword}
            showPassword={showPasswords.confirmPassword}
            onTogglePassword={() => onTogglePassword('confirmPassword')}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .Mui-focused .MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
            }}
          />
          {passwordsMismatch && !errors.confirmPassword && (
            <FormHelperText
              sx={{
                color: 'red',
                mt: 1,
                ml: 1,
              }}
            >
              Passwords don't match
            </FormHelperText>
          )}
        </Box>

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
  otpAttempts: number;
  otp: string;
  otpHash: string;
  otpTimer: number;
  currentStep: 'email' | 'otp' | 'newPassword';
  alert: {
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [touched, setTouched] = useState(false);
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
    otpAttempts: 0,
    otpTimer: 600,
    currentStep: 'email',
    alert: {
      message: '',
      severity: 'success',
    },
  });

  const handleSendOtp = useCallback(async () => {
    const { email } = state.forgotData;
    setTouched(true);
    if (!validateEmail(email)) {
      setState((prev) => ({
        ...prev,
        forgotErrors: {
          ...prev.forgotErrors,
          email: 'Please enter a valid email address',
        },
      }));
      return;
    }

    try {
      const checkResponse = await fetch(
        `${process.env.BASE_URL}/user/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
          },
          body: JSON.stringify({ username: email }),
        }
      );

      const checkResult = await checkResponse.json();
      const userData = checkResult?.result?.[0];

      if (!userData) {
        setState((prev) => ({
          ...prev,
          alert: {
            message: 'User does not exist with this email.',
            severity: 'error',
          },
        }));
        return;
      }

      const firstName = userData.firstName || '';

      const response = await fetch(`${process.env.BASE_URL}/user/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reason: 'forgot',
          key: 'SendOtpOn',
          firstName,
          replacements: {
            '{eventName}': 'ATREE OTP',
            '{programName}': 'ATREE',
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setState((prev) => ({
          ...prev,
          otpHash: result?.result?.data?.hash || '',
          currentStep: 'otp',
          otpTimer: 600,
          otpAttempts: prev.otpAttempts + 1,
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
      console.error('Error during OTP send flow:', err);
      setState((prev) => ({
        ...prev,
        alert: { message: 'An error occurred.', severity: 'error' },
      }));
    }
  }, [state.forgotData.email]);

  const verifyOtp = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/user/verify-otp`, {
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
      });

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

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setState((prev) => ({
      ...prev,
      forgotErrors: newErrors,
    }));

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.BASE_URL}/user/forgot-password`,
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
        try {
          setState((prev) => ({
            ...prev,
            alert: {
              message: 'Password reset was successful!',
              severity: 'success',
            },
          }));

          setTimeout(() => {
            router.push('/signin');
          }, 4000);
        } catch (loginError) {
          setState((prev) => ({
            ...prev,
            alert: {
              message: 'Password reset failed. Please try again.',
              severity: 'warning',
            },
          }));
        }
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
  }, [state.forgotData, state.otpHash, router]);

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
          [field]: '',
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
            otpAttempts={state.otpAttempts}
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

          {state.currentStep !== 'newPassword' && (
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

export default ForgotPasswordPage;
