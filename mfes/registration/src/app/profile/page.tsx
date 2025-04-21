'use client';

import { useState, useEffect } from 'react';
import {
  getUserByToken,
  myCourseDetails,
  renderCertificate,
} from '../../services/ProfileService';
import { resetPasswordLink } from '../../services/LoginService';
import {
  AlertTitle,
  Box,
  Card,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import { Layout } from '@shared-lib';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');

  const [courseDetails, setCourseDetails] = useState<any>(null);
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
    handleMyCourses();
  }, []);

  const handleMyCourses = async () => {
    const token = localStorage.getItem('accToken');
    if (token) {
      const userId = localStorage.getItem('userId');
      const detailsResponse = await myCourseDetails({
        token,
        userId,
      });
      setCourseDetails(detailsResponse?.result);
      console.log('detailsResponse', detailsResponse);
    }
  };
  const handleViewTest = async (certificateId: string) => {
    console.log('View Test clicked for course:', certificateId);

    try {
      const response = await renderCertificate(certificateId);
      console.log('Certificate HTML:', typeof response, response);
    
      const certificateHtml = response?.result; // <-- grab HTML from the 'result' field
    
      const blob = new Blob([certificateHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error rendering certificate:', err);
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
      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Profile Card */}
        <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            👤 User Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {[user?.firstName, user?.middleName, user?.lastName]
                  .filter(Boolean)
                  .join(' ')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Username
              </Typography>
              <Typography variant="body1">{user?.username}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">{user?.gender}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tenant
              </Typography>
              <Typography variant="body1">
                {user?.tenantData?.[0]?.tenantName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">
                {user?.tenantData?.[0]?.roleName}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Courses Card */}
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            📘 My Courses
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {courseDetails?.data?.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseDetails?.data
                    ?.filter(
                      (course: any) => course.status === 'viewCertificate'
                    )
                    .map((course: any) => (
                      <TableRow
                        key={course.usercertificateId}
                        hover
                        sx={{
                          transition: '0.3s',
                          '&:hover': { backgroundColor: '#f9f9f9' },
                        }}
                      >
                        <TableCell>{course.courseId}</TableCell>
                        <TableCell>{course.status}</TableCell>
                        <TableCell>
                          <Link
                            component="button"
                            variant="body2"
                            underline="hover"
                            onClick={() => handleViewTest(course.certificateId)}
                          >
                            View Certificate
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No course data found.
            </Typography>
          )}
        </Card>
      </Box>
    </Layout>
  );
}
