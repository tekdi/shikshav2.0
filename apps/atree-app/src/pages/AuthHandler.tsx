import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { createUser, getUserAuthInfo, signin } from '../service/content';

import GlobalAlert from '../component/GlobalAlert';
import { useRouter } from 'next/router';
import { CommonDialog } from '@shared-lib';
import { Box, Button, Typography } from '@mui/material';

const AuthHandler = () => {
  const router = useRouter();

  const { keycloak, initialized } = useKeycloak();
  const tenantCohortRoleMapping = [
    {
      tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
      roleId:
        localStorage.getItem('role') || '5771c07f-2afd-4cef-b8f1-55eba2a27908',
    },
  ];

  const [showAlertMsg, setShowAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');
  const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const registerUser = async (data: any) => {
    try {
      const payload = data;
      const response = await createUser(payload);
      if (response?.responseCode === 201) {
        const credentials = {
          email: data.email,
          password: data.password,
        };
        chekLogin(credentials);

        setShowAlertMsg('User Login successfully!');
        setAlertSeverity('success');
        setTimeout(() => {
          setShowAlertMsg('');
        }, 3000);
        // router.push(`/home`);
        setOpenUserDetailsDialog(true);
      } else if (response?.response?.data?.responseCode === 400) {
        setShowAlertMsg(response?.response?.data?.params?.err);
        setAlertSeverity('error');
        console.log('error', response?.response?.data?.params?.err);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const checkUser = async (data: any) => {
    try {
      const authCheck = await getUserAuthInfo({ token: data });
      console.log('userExist', authCheck);
      if (authCheck?.result) {
        return authCheck;
      } else {
        console.log('User already exists, redirecting...');
        // router.push('/home');
      }
    } catch (error) {
      console.log('User does not exist, proceeding to register...');
    }
  };
  const chekLogin = async (credentials: any) => {
    const response = await signin(credentials);

    if (response?.result?.access_token) {
      localStorage.setItem('token', response.result.access_token);
      localStorage.setItem('refreshToken', response.result.refresh_token);
      const authInfo = await getUserAuthInfo({
        token: response?.result?.access_token,
      });

      localStorage.setItem('role', authInfo?.result?.tenantData?.[0]?.roleName);
      //   router.push('/home');
    } else {
      setShowAlertMsg(
        response?.response?.data?.params?.errmsg || 'Login failed'
      );
    }
  };
  useEffect(() => {
    if (!initialized) {
      console.log('Keycloak not initialized yet');
    }
  }, [initialized]);
  useEffect(() => {
    if (!initialized) {
      console.log('Keycloak not initialized yet');
      return;
    }
    const asyncFun = async () => {
      if (keycloak?.authenticated && keycloak.token) {
        const decodedToken = jwtDecode<any>(keycloak.token);

        localStorage.setItem('token', keycloak.token);
        localStorage.setItem('refreshToken', keycloak.refreshToken || '');
        localStorage.setItem('username', decodedToken.name || '');
        const [fName, ...lastNameArr] = decodedToken?.name.trim().split(' ');
        const lName = lastNameArr.join(' ');
        const username = decodedToken?.email.split('@')[0];
        const userExist = await checkUser(keycloak.token);
        setFormData({ username: username, password: 'password123' });
        if (userExist?.result) {
          registerUser({
            firstName: fName,
            lastName: lName,
            username: username,
            email: decodedToken?.email,
            password: 'password123',
            gender: 'female',
            tenantCohortRoleMapping: tenantCohortRoleMapping,
          });
        } else {
          const credentials = {
            email: username,
            password: 'password123',
          };
          chekLogin(credentials);
          setOpenUserDetailsDialog(true);
        }
      } else {
        console.log('User not authenticated');
      }
    };
    asyncFun();
  }, [initialized, keycloak?.authenticated]);
  const handleCloseUserDetailsDialog = () => {
    setOpenUserDetailsDialog(false);
    router.push('/home');
  };
  return (
    <Box>
      <GlobalAlert
        message={showAlertMsg}
        severity={alertSeverity}
        onClose={() => setShowAlertMsg('')}
      />
      <CommonDialog
        isOpen={openUserDetailsDialog}
        onClose={() => setOpenUserDetailsDialog(false)}
        header="User Details"
        hideCloseButton={true}
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              <strong>Username:</strong> {formData.username}
            </Typography>
            <Typography variant="body1">
              <strong>Password:</strong> {formData.password}
            </Typography>
            <Typography variant="body1">
              <strong>Note:</strong> Please save your username and password for
              future use.
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
    </Box>
  );
};

export default AuthHandler;
