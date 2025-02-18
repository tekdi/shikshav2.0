'use client';
import React, { useState } from 'react';
import { Button, FormLabel, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommonSelect, CommonTextField, Layout } from '@shared-lib';
import { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const languageData = [
  { id: 1, name: 'Educator' },
  { id: 2, name: 'Mentor' },
  { id: 3, name: 'Student' },
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState({
    name: false,
    email: false,
  });
  const [selectedValue, setSelectedValue] = useState('Educator');
  const router = useRouter();
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

  const handleButtonClick = async () => {
    router.push('/verifyOTP');
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Layout
      isFooter={false}
      showLogo={true}
      showBack={true}
      type="Image"
      showTopAppBar={{
        showSearch: true,
        title: 'Jal-Jungle-Jameen ',
        subtitle: 'In Classrooms ',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
      }}
      // sx={{ height: '100vh' }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          width: '100%',
          borderRadius: 1,
          bgcolor: '#FFFFFF',
          justifyContent: 'center',

          padding: 2,
          mx: 'auto',
          marginTop: '60px',
        }}
      >
        <Grid
          size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: '20px 20px 0 0',
            padding: '15px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <FormLabel component="legend">Full Name</FormLabel>
          <CommonTextField
            label="Full Name"
            value={formData.name}
            onChange={handleChange('name')}
            type="text"
            variant="outlined"
            helperText={error.name ? `Enter full name ` : ''}
            error={error.name}
          />
          <FormLabel component="legend">Email ID</FormLabel>

          <CommonTextField
            label="Email ID"
            value={formData.email}
            onChange={handleChange('email')}
            type={'text'}
            variant="outlined"
            helperText={error.email ? `Enter Email ID ` : ''}
            error={error.email}
          />
          <FormLabel component="legend">Select Role</FormLabel>
          <CommonSelect
            label="Select Role"
            value={selectedValue}
            onChange={handleSelectChange}
            options={languageData.map(({ name }) => ({
              label: name,
              value: name.toLowerCase(),
            }))}
            // borderRadius="8px"
          />

          <Button
            onClick={handleButtonClick}
            sx={{
              color: '#FFFFFF',
              width: '100%',
              height: '40px',
              background:
                'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Proceed
          </Button>
          <Typography
            textAlign={'center'}
            variant="h1"
            fontSize={'16px'}
            color="#3B383E"
            fontWeight={500}
          >
            Already Have An Account? <Link href="/newUser">Log In </Link>
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}
