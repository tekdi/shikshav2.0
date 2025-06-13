import { ArrowBack, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Layout from '../component/layout/layout';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export const OtpVerificationScreen = ({
  open,
  onClose,
  otp,
  setOtp,
  otpTimer,
  verifyOtp,
  formatTime,
  email,
  resendCode,
}: {
  open: boolean;
  onClose: () => void;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  otpTimer: number;
  verifyOtp: () => void;
  formatTime: (seconds: number) => string;
  email: string;
  resendCode?: () => void;
}) => {
  if (!open) return null;
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits
    const otpArray = otp.split('');
    otpArray[index] = value;
    const newOtp = otpArray.join('');
    setOtp(newOtp);
  };

  const renderOtpInputs = () => {
    const otpArray = otp.padEnd(6, ' ').split('');
    return (
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
        {Array(6)
          .fill('')
          .map((_, i) => (
            <TextField
              key={i}
              value={otpArray[i]}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              inputProps={{
                maxLength: 1,
                inputMode: 'numeric',
                style: {
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  width: '40px',
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                },
              }}
            />
          ))}
      </Box>
    );
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
        {/* Header */}

        {/* Content */}
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
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1, fontFamily: 'Poppins', color: '#666' }}
          >
            Enter the 6-digit code sent to your email
          </Typography>
          {/* <TextField
            fullWidth
            label="Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 2, mt: 3 }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 6,
            }}
          /> */}
          <TextField
            fullWidth
            margin="normal"
            value={email}
            disabled
            InputProps={{ style: { backgroundColor: '#f3f3f3' } }}
            sx={{ mt: 3 }}
          />
          {/* OTP boxes */}
          {renderOtpInputs()}
          {/* Resend Code Timer */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, fontFamily: 'Poppins', textAlign: 'left' }}
          >
            {otpTimer > 0 ? (
              <>
                <Typography
                  component="span"
                  sx={{
                    color: '#1a73e8',
                    cursor: 'default',
                    textDecoration: 'underline',
                  }}
                >
                  Resend Code
                </Typography>{' '}
                in: <strong>{formatTime(otpTimer)}</strong>
              </>
            ) : (
              <Typography
                component="span"
                onClick={resendCode}
                sx={{
                  color: '#1a73e8',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Resend Code
              </Typography>
            )}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={verifyOtp}
            disabled={!otp || otp.length < 6}
            sx={{
              mt: '10%',
              height: 48,
              borderRadius: '24px',
              backgroundColor: '#fcd804',
              color: '#000',
              fontFamily: 'Poppins',
              fontWeight: 500,
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
              },
            }}
          >
            Verify & Proceed
          </Button>
          {/* <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 3 }}>
            {otpTimer > 0 ? (
              <>
                Code expires in: <strong>{formatTime(otpTimer)}</strong>
              </>
            ) : (
              'The code has expired. Please request a new one.'
            )}
          </Typography> */}
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
