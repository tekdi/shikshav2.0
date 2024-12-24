'use client';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
      showTopAppBar={true}
      isFooter={false}
      showLogo={true}
      showBack={true}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
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
          onChange={handleChange('firstName')}
          type="text"
          variant="outlined"
          helperText={error.userName ? `Required username ` : ''}
          error={error.userName}
        />
        <CommonTextField
          label="Password"
          value={formData.userName}
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
          fontWeight="500px"
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
          width="353px"
          height="40px"
          backgroundColor="#6750A4"
          borderRadius="50px"
          color="#FFFFFF"
          fontSize="14px"
          fontWeight="500px"
          supportingText="Don’t Have An Account? Register"
          onClick={handleButtonClick}
        />
      </Box>
    </Layout>
  );
}
