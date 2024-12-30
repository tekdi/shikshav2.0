'use client';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid2';

import {
  CommonCheckbox,
  CommonSelect,
  CommonTextField,
  CustomButton,
  CustomTypography,
  Layout,
} from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
const languageData = [
  { id: 1, name: 'English' },
  { id: 2, name: 'Marathi' },
  { id: 3, name: 'Hindi' },
  { id: 4, name: 'Gujarati' },
  { id: 5, name: 'Bengali' },
  { id: 6, name: 'Tamil' },
];

const checkboxData = [{ label: 'Remember Me' }];

export default function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState({
    userName: false,
    password: false,
  });
  const [selectedValue, setSelectedValue] = useState('english');
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData({
        ...formData,
        [field]: value,
      });
      setError({
        ...error,
        [field]: value.trim() === '',
      });
    };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    label: string
  ) => {
    console.log(
      `Checkbox '${label}' is now ${checked ? 'checked' : 'unchecked'}`
    );
  };
  const handleButtonClick = () => {
    alert('button clicked!');
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };
  return (
    <Layout
      isFooter={false}
      showLogo={true}
      showBack={true}
      sx={{ height: '100vh' }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: '100%',
          borderRadius: 1,
          bgcolor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          mx: 'auto',
        }}
      >
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 4 }}
          sx={{
            backgroundColor: '#444444',
            height: '100%',
            display: 'flex',
            // flexDirection: 'column',
            justifyContent: 'center',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
          }}
        >
          {/* <Box
            sx={{
              height: '-webkit-fill-available',
              backgroundColor: '#444444',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          > */}
          <CustomTypography
            variant="h1"
            fontSize="18px"
            color="#1D1B20"
            fontWeight={500}
          >
            Placeholder Content
          </CustomTypography>
          {/* </Box> */}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              borderRadius: '20px 20px 0 0',
              padding: '15px',
              backgroundColor: '#FFFFFF',
              marginTop: '-40px',
            }}
          >
            <CommonSelect
              label=""
              value={selectedValue}
              onChange={handleSelectChange}
              options={[
                { label: 'English', value: 'english' },
                { label: 'Marathi', value: 'marathi' },
                { label: 'Hindi', value: 'hindi' },
              ]}
              width="100px"
              height="32px"
              borderRadius="8px"
            />
            <CommonTextField
              label="Username"
              value={formData.userName}
              onChange={handleChange('userName')}
              type="text"
              variant="outlined"
              helperText={error.userName ? `Required username ` : ''}
              error={error.userName}
            />
            <CommonTextField
              label="Password"
              value={formData.password}
              onChange={handleChange('password')}
              type="password"
              variant="outlined"
              helperText={error.password ? `Required password ` : ''}
              error={error.password}
              endIcon={<VisibilityIcon />}
            />
            <CustomTypography
              variant="h1"
              fontSize="14px"
              color="#1D1B20"
              fontWeight={500}
            >
              Forgot Password?
            </CustomTypography>

            <CommonCheckbox
              checkboxes={checkboxData}
              onChange={handleCheckboxChange}
              direction="row"
            />

            <CustomButton
              label="Label"
              width="100%"
              height="40px"
              backgroundColor="#6750A4"
              borderRadius="50px"
              color="#FFFFFF"
              fontSize="14px"
              fontWeight={500}
              supportingText="Don’t Have An Account? Register"
              onClick={handleButtonClick}
            />
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
}
