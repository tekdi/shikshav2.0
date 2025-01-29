'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';

export default function AuthCheck() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const URL_CONTENT = process.env.NEXT_PUBLIC_CONTENT;
  const URL_LOGIN = process.env.NEXT_PUBLIC_LOGIN;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accToken = localStorage.getItem('accToken');
      const refToken = localStorage.getItem('refToken');

      if (accToken && refToken) {
        //@ts-ignore
        router.replace(URL_CONTENT); // Redirect if tokens are present
      } else {
        //@ts-ignore
        router.replace(URL_LOGIN); // Redirect to login if missing
      }
    }
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress size={60} />
    </Box>
  );
}
