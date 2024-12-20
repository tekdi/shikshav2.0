'use client';
import React from 'react';
import { Box } from '@mui/material';
import { CustomStack, CustomTypography, Layout } from '@shared-lib';
const languageData = [
  { id: 1, name: 'English' },
  { id: 2, name: 'Marathi' },
  { id: 3, name: 'Hindi' },
  { id: 4, name: 'Gujarati' },
  { id: 5, name: 'Bengali' },
  { id: 6, name: 'Tamil' },
];
const LanguageBox = ({ name }: { name: string }) => (
  <Box
    sx={{
      width: '150px',
      borderRadius: '16px',
      border: '1px solid #D0C5B4',
      padding: 2,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {name}
  </Box>
);
export default function Login() {
  return (
    <Layout
      showTopAppBar={true}
      isFooter={true}
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
        <CustomTypography variant="h1" fontSize={'22px'} color="#3B383E">
          Welcome!
        </CustomTypography>

        <CustomTypography variant="h2" fontSize={'16px'} color="#3B383E">
          Start by selecting a language of App
        </CustomTypography>
        <CustomTypography variant="h3" fontSize={'14px'} color="#3B383E">
          Choose the language for menus and navigation
        </CustomTypography>
        <CustomStack
          data={languageData}
          itemsPerRow={2}
          renderItem={(item: any) => (
            <LanguageBox key={item.id} name={item.name} />
          )}
        />
      </Box>
    </Layout>
  );
}
