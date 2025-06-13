import { ArrowBack } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material';
import { CommonTextField } from '@shared-lib';
import Layout from '../component/layout/layout';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useState } from 'react';
export const Forgotpassword = ({
  open,
  onClose,
  forgotData,
  setForgotData,
  forgotErrors,
  handleSendOtp,
  setForgotErrors,
}: {
  open: boolean;
  onClose: () => void;
  forgotData: {
    email: string;
    registeredWithGoogle: boolean;
  };
  setForgotData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      newPassword: string;
      confirmPassword: string;
      registeredWithGoogle: boolean;
    }>
  >;
  forgotErrors: {
    email: string;
  };
  setForgotErrors: React.Dispatch<
    React.SetStateAction<{
      email: string;
    }>
  >;
  handleSendOtp: () => void;
}) => {
  const [isEmailValid, setIsEmailValid] = useState(false);

  if (!open) return null;
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setForgotData((prev) => ({
      ...prev,
      email,
    }));

    if (!email) {
      setForgotErrors((prev) => ({
        ...prev,
        email: 'Email is required',
      }));
      setIsEmailValid(false);
    } else if (!validateEmail(email)) {
      setForgotErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
      setIsEmailValid(false);
    } else {
      setForgotErrors((prev) => ({
        ...prev,
        email: '',
      }));
      setIsEmailValid(true);
    }
  };
  return (
    <Layout showTopAppBar>
      <Box
        sx={{
          position: 'fixed',
          top: '12%',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'background.paper',
          zIndex: 1300,
          overflowY: 'auto',
          p: 2,
        }}
      >
        {/* Header with back button */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <LockOpenIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography
            variant="h6"
            align="center"
            textAlign={'center'}
            sx={{
              mt: 2,
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '22px',
            }}
          >
            Forgot Password?
          </Typography>
          {/* Content */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: 400,
                textAlign: 'center',
              }}
            >
              Enter your email address to receive a verification code
            </Typography>
          </Box>
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={forgotData.registeredWithGoogle}
                sx={{
                  color: '#fcd804',
                  '&.Mui-checked': { color: '#fcd804' },
                }}
                onChange={(e) => {
                  setForgotData((prev) => ({
                    ...prev,
                    registeredWithGoogle: e.target.checked,
                    email: e.target.checked ? '' : prev.email,
                  }));
                }}
              />
            }
            label="I registered using Google account"
            sx={{ fontFamily: 'Poppins', mb: 2 }}
          /> */}

          {forgotData.registeredWithGoogle ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Password reset is not available for Google-registered accounts.
              Please sign in with Google.
            </Alert>
          ) : (
            <CommonTextField
              fullWidth
              type="email"
              label="Enter email"
              value={forgotData.email}
              onChange={handleEmailChange}
              helperText={forgotErrors.email}
              error={Boolean(forgotErrors.email)}
              // sx={{ mb: 3 }}
            />
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={
              forgotData.registeredWithGoogle ||
              !forgotData.email ||
              !isEmailValid ||
              !!forgotErrors.email
            }
            sx={{
              mt: '10%',
              height: 48,
              borderRadius: '24px',
              backgroundColor: '#fcd804',
              color: '#000',
              fontFamily: 'Poppins',
              fontWeight: 500,
              textTransform: 'none',
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#888',
              },
            }}
          >
            Next
          </Button>
        </Box>
        <Divider sx={{ my: 10 }} />
        {/* Fixed footer button */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 50,
            left: 16,
            right: 16,
          }}
        >
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Poppins',
                color: '#0E28AE',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                // textDecoration: 'underline',
              }}
              onClick={onClose}
            >
              Back to Login
            </Typography>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};
export default Forgotpassword;
