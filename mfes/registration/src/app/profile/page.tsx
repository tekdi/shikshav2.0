'use client';

import { useState, useEffect } from 'react';
import { getUserByToken } from '../../services/ProfileService';
import { resetPasswordLink } from '../../services/LoginService';
import {
  AlertTitle,
  Box,
  Button,
  Card,
  Divider,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import { CommonTextField, Layout } from '@shared-lib';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSameAsOld, setPasswordSameAsOld] = useState(false);
  const [currentPasswordNotMatched, setCurrentPasswordNotMatched] =
    useState(false);
  const [passwordResetLinkSent, setPasswordResetLinkSent] = useState(false);
  const URL_LOGIN = process.env.NEXT_PUBLIC_LOGIN;

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== 'undefined') {
        const accToken = localStorage.getItem('accToken');
        const refToken = localStorage.getItem('refToken');

        if (!accToken || !refToken) {
          if (typeof URL_LOGIN === 'string') {
            window.location.href = URL_LOGIN;
          }
        }
      }

      try {
        const accessToken = localStorage.getItem('accToken');
        if (accessToken) {
          setToken(accessToken);
          const response = await getUserByToken(accessToken);
          setUser(response);
        }
        setLoading(false);
      } catch (err) {
        setError(err as string);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await resetPasswordLink({ token });
      if (response.data.success) {
        setPasswordResetLinkSent(true);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err as string);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      // const response = await post(`/user/v1/update-password`, {
      //   token,
      //   newPassword,
      // });
      // if (response.data.success) {
      //   setPasswordSameAsOld(false);
      //   setCurrentPasswordNotMatched(false);
      // } else if (response.data.error === 'currentPasswordNotMatched') {
      //   setCurrentPasswordNotMatched(true);
      // } else if (response.data.error === 'passwordSameAsOld') {
      //   setPasswordSameAsOld(true);
      // }
      setPasswordSameAsOld(false);
      setCurrentPasswordNotMatched(false);
    } catch (err) {
      setError(err as string);
    }
  };
  console.log(user);
  return (
    <Layout
      showTopAppBar={{
        title: 'Profile',
        showMenuIcon: false,
        showBackIcon: true,
        actionButtonLabel: 'Action',
        backIconClick: () => window.history.back(),
      }}
      isLoadingChildren={loading}
    >
      <Box sx={{ p: 2 }}>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom>
                User Profile
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Name:
              </Typography>
              <Typography variant="body1">
                {[user?.firstName, user?.middleName, user?.lastName]
                  .filter(Boolean)
                  .join(' ')}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Username:
              </Typography>
              <Typography variant="body1">{user?.username}</Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Gender:
              </Typography>
              <Typography variant="body1">{user?.gender}</Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Temporary Password:
              </Typography>
              <Typography variant="body1">
                {user?.temporaryPassword ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Tenant Name:
              </Typography>
              <Typography variant="body1">
                {user?.tenantData?.[0]?.tenantName}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Role Name:
              </Typography>
              <Typography variant="body1">
                {user?.tenantData?.[0]?.roleName}
              </Typography>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom>
                Reset Password
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonTextField
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonTextField
                type="password"
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                sx={{ mt: 2, mr: 2 }}
              >
                Send Reset Password Link
              </Button>
              {passwordResetLinkSent && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <AlertTitle>Success</AlertTitle>
                  Password reset link sent
                </Alert>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdatePassword}
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
              {passwordSameAsOld && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  Password same as old
                </Alert>
              )}
              {currentPasswordNotMatched && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  Current Password Not Matched
                </Alert>
              )}
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Layout>
  );
}
