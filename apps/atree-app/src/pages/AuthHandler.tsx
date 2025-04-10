import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { createUser, getUserAuthInfo, signin } from '../service/content';
import { SelectChangeEvent } from '@mui/material/Select';
import { languageData } from '../utils/constantData';

import GlobalAlert from '../component/GlobalAlert';
import { useRouter } from 'next/router';
import { CommonDialog, CommonSelect } from '@shared-lib';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Typography,
} from '@mui/material';

const AuthHandler = () => {
  const router = useRouter();

  const { keycloak, initialized } = useKeycloak();
  const [tenantCohortRoleMapping, setTenantCohortRoleMapping] = useState([
    {
      tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
      roleId: '', // default fallback
    },
  ]);

  const [showAlertMsg, setShowAlertMsg] = useState('');
  const [selectedValue, setSelectedValue] = useState('Educator');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');
  const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [registerFormData, setRegisterFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    tenantCohortRoleMapping: tenantCohortRoleMapping,
  });
  const defaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD ?? '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole =
        localStorage.getItem('role') ?? '5771c07f-2afd-4cef-b8f1-55eba2a27908';

      setTenantCohortRoleMapping([
        {
          tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
          roleId: storedRole,
        },
      ]);
    }
  }, []);
  const registerUser = () => {
    setOpenDialog(true);
  };
  const checkUser = async (data: any) => {
    try {
      const authCheck = await getUserAuthInfo({ token: data });
      if (authCheck?.responseCode === 200) {
        return authCheck;
      } else {
        console.log('User already exists, redirecting...');
        return { result: true };
      }
    } catch (error) {
      console.log('User does not exist, proceeding to register...');
      return { result: false };
    }
  };
  const chekLogin = async (credentials: any) => {
    const response = await signin(credentials);
    console.log('response', response);
    if (response?.result?.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.result.access_token);
        localStorage.setItem('refreshToken', response.result.refresh_token);
      }

      const authInfo = await getUserAuthInfo({
        token: response?.result?.access_token,
      });
      console.log('authInfo', authInfo);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'role',
          authInfo?.result?.tenantData?.[0]?.roleName
        );
      }
      return true;
    } else {
      return false;
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
      if (typeof window === 'undefined') return;
      const alreadyHandled = localStorage.getItem('userHandled');
      if (alreadyHandled === 'true') {
        console.log('User already handled, skipping registration/login.');
        return;
      }
      if (keycloak?.authenticated && keycloak.token) {
        const decodedToken = jwtDecode<any>(keycloak.token);

        localStorage.setItem('token', keycloak.token);
        localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
        localStorage.setItem('username', decodedToken.name ?? '');

        let fName = '';
        let lName = '';

        const fullName = decodedToken?.name?.trim();

        if (fullName) {
          const [first, ...last] = fullName.split(' ');
          fName = first;
          lName = last.join(' ');
        }
        const username = decodedToken?.email.split('@')[0];
        const userExist = await checkUser(keycloak.token);
        console.log('decodedToken', decodedToken);
        setFormData({ username: username, password: defaultPassword });
        if (userExist?.result === false) {
          //else {
          const credentials = {
            email: username,
            password: defaultPassword,
          };
          const loginSuccess = await chekLogin(credentials);
          if (loginSuccess) {
            setOpenUserDetailsDialog(true);
          } else {
            setRegisterFormData({
              firstName: fName,
              lastName: lName,
              username: username,
              email: decodedToken?.email,
              password: defaultPassword,
              gender: 'female',
              tenantCohortRoleMapping: tenantCohortRoleMapping,
            });
            registerUser();
          }
        }
        localStorage.setItem('userHandled', 'true');
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
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const roleId = event.target.value;
    setSelectedValue(roleId);
    setTenantCohortRoleMapping([
      {
        tenantId: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
        roleId: roleId,
      },
    ]);
    localStorage.setItem('role', roleId);
  };
  const handleDialogOk = async () => {
    if (!selectedValue) {
      return;
    }

    // Save the role selection
    setOpenDialog(false);

    try {
      const payload = registerFormData;

      const response = await createUser(payload);
      if (response?.responseCode === 201) {
        const credentials = {
          email: registerFormData.username,
          password: registerFormData.password,
        };
        const loginSuccess = await chekLogin(credentials);
        console.log(loginSuccess);
        if (loginSuccess) {
          setOpenUserDetailsDialog(true);
        } else {
          router.push('/signin'); // redirect on login failure
        }

        setShowAlertMsg('User Login successfully!');
        setAlertSeverity('success');
        setTimeout(() => {
          setShowAlertMsg('');
        }, 3000);
      } else if (response?.response?.data?.responseCode === 400) {
        console.log('auth');
        setShowAlertMsg(response?.response?.data?.params?.err);
        setAlertSeverity('error');
        console.log('error', response?.response?.data?.params?.err);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Box>
      <GlobalAlert
        message={showAlertMsg}
        severity={alertSeverity}
        onClose={() => setShowAlertMsg('')}
      />
      {/* Role selection dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        disableEscapeKeyDown
        PaperProps={{
          style: {
            width: '300px',
            maxHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          },
        }}
      >
        <DialogTitle>Select Role</DialogTitle>
        <DialogContent>
          <FormLabel component="legend" sx={{ color: '#4D4639' }}>
            Select Role<span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <CommonSelect
            value={selectedValue}
            onChange={handleRoleChange}
            options={languageData.map(({ title, roleId }) => ({
              label: title,
              value: roleId,
            }))}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDialogOk}
            sx={{ borderRadius: '50px', height: '40px', width: '100%' }}
          >
            Procced
          </Button>
        </DialogActions>
      </Dialog>
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
              Procced
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
