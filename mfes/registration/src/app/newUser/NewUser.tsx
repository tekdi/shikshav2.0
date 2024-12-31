'use client';
import { Layout, CommonTextField } from '@shared-lib';
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
const NewUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
  });
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

  return (
    <Layout isFooter={true} showBack={true}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <Avatar alt="Remy Sharp" src="" />
          <Typography
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            What’s your name and phone number?
          </Typography>
        </div>

        <CommonTextField
          label="First name"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          type="text"
          variant="outlined"
          helperText={error.firstName ? `Required first name ` : ''}
          error={error.firstName}
        />
        <CommonTextField
          label="Last name"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          type="text"
          variant="outlined"
          helperText={error.lastName ? 'Required last name' : ''}
          error={error.lastName}
        />
        <CommonTextField
          label="Phone number"
          value={formData.phoneNumber}
          onChange={handleChange('phoneNumber')}
          type="text"
          variant="outlined"
          helperText={error.phoneNumber ? 'Required phoen number' : ''}
          error={error.phoneNumber}
          supportingText="It will help us stay connected and share important updates"
        />
      </div>
    </Layout>
  );
};
export default NewUser;
