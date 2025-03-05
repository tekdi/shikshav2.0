'use client';

import React, { useEffect } from 'react';
import { setData } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box } from '@mui/material';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import dynamic from 'next/dynamic';

interface ListProps {}

const Signin = dynamic(() => import('@Atreelogin'), {
  ssr: false,
});
const Login: React.FC<ListProps> = () => {
  return (
    <Layout>
      <Signin />
    </Layout>
  );
};

export default Login;
