import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import { CommonTextField } from '@shared-lib';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Layout from '../component/layout/layout';

interface ForgotData {
  email: string;
  newPassword: string;
  confirmPassword: string;
  registeredWithGoogle: boolean;
}

interface ForgotErrors {
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  newPassword: boolean;
  confirmPassword: boolean;
}

export const NewPasswordScreen = ({
  open,
  onClose,
  forgotData,
  setForgotData,
  forgotErrors,
  setForgotErrors,
  showPasswords,
  togglePasswordVisibility,
  resetPassword,
  isResetDisabled,
  passwordRegex,
}: {
  open: boolean;
  onClose: () => void;
  forgotData: ForgotData;
  setForgotData: React.Dispatch<React.SetStateAction<ForgotData>>;
  forgotErrors: ForgotErrors;
  setForgotErrors: React.Dispatch<React.SetStateAction<ForgotErrors>>;
  showPasswords: ShowPasswords;
  togglePasswordVisibility: (field: 'newPassword' | 'confirmPassword') => void;
  resetPassword: () => void;
  isResetDisabled: boolean;
  passwordRegex: RegExp;
}) => {
  if (!open) return null;

  const passwordRequirements = [
    'At least 8 characters',
    'At least one uppercase letter (A-Z)',
    'At least one lowercase letter (a-z)',
    'At least one number (0-9)',
    'At least one special character (!@#$%^&*)',
  ];

  const isRequirementMet = (requirement: string) => {
    if (!forgotData.newPassword) return false;

    switch (requirement) {
      case 'At least 8 characters':
        return forgotData.newPassword.length >= 8;
      case 'At least one uppercase letter (A-Z)':
        return /[A-Z]/.test(forgotData.newPassword);
      case 'At least one lowercase letter (a-z)':
        return /[a-z]/.test(forgotData.newPassword);
      case 'At least one number (0-9)':
        return /\d/.test(forgotData.newPassword);
      case 'At least one special character (!@#$%^&*)':
        return /[!@#$%^&*]/.test(forgotData.newPassword);
      default:
        return false;
    }
  };

  return (
    <Layout showTopAppBar>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <IconButton onClick={onClose} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              fontFamily: 'Poppins',
              fontSize: '1.25rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Set New Password
          </Typography>
          <Box sx={{ width: 40 }} /> {/* Spacer for alignment */}
        </Box>

        {/* Content */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, fontFamily: 'Poppins' }}>
            Create a strong password that meets all the requirements below.
          </Typography>

          {/* Password Requirements */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Password must contain:
            </Typography>
            <List dense sx={{ p: 0 }}>
              {passwordRequirements.map((req) => (
                <ListItem key={req} sx={{ p: 0, mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CheckCircleOutlineIcon
                      fontSize="small"
                      color={isRequirementMet(req) ? 'success' : 'disabled'}
                    />
                  </ListItemIcon>
                  <Typography
                    variant="body2"
                    color={
                      isRequirementMet(req) ? 'text.primary' : 'text.secondary'
                    }
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {req}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* New Password Field */}
          <Box sx={{ mb: 3 }}>
            <CommonTextField
              fullWidth
              type={showPasswords.newPassword ? 'text' : 'password'}
              label="New Password"
              value={forgotData.newPassword}
              onChange={(e) => {
                const newPassword = e.target.value;
                setForgotData((prev) => ({ ...prev, newPassword }));

                if (
                  forgotData.confirmPassword &&
                  newPassword !== forgotData.confirmPassword
                ) {
                  setForgotErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match',
                  }));
                } else {
                  setForgotErrors((prev) => ({
                    ...prev,
                    confirmPassword: '',
                  }));
                }
              }}
              error={Boolean(
                forgotErrors.newPassword ||
                  (forgotData.newPassword &&
                    !passwordRegex.test(forgotData.newPassword))
              )}
              endIcon={
                <IconButton
                  onClick={() => togglePasswordVisibility('newPassword')}
                  edge="end"
                >
                  {showPasswords.newPassword ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              }
            />
            {forgotErrors.newPassword && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {forgotErrors.newPassword}
              </Typography>
            )}
          </Box>

          {/* Confirm Password Field */}
          <Box sx={{ mb: 3 }}>
            <CommonTextField
              fullWidth
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={forgotData.confirmPassword}
              onChange={(e) => {
                const confirmPassword = e.target.value;
                setForgotData((prev) => ({ ...prev, confirmPassword }));

                if (forgotData.newPassword !== confirmPassword) {
                  setForgotErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match',
                  }));
                } else {
                  setForgotErrors((prev) => ({
                    ...prev,
                    confirmPassword: '',
                  }));
                }
              }}
              error={Boolean(forgotErrors.confirmPassword)}
              endIcon={
                <IconButton
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  edge="end"
                >
                  {showPasswords.confirmPassword ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              }
            />
            {forgotErrors.confirmPassword && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {forgotErrors.confirmPassword}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Fixed footer button */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            right: 16,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={resetPassword}
            disabled={isResetDisabled}
            sx={{
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
            Reset Password
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
