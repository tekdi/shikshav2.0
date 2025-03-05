'use client';

import React, { useEffect } from 'react';
import { setData } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box } from '@mui/material';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import dynamic from 'next/dynamic';

interface ListProps {}

const Signup = dynamic(() => import('@Atreeregister'), {
  ssr: false,
});
const Register: React.FC<ListProps> = () => {
  return (
    <Layout>
      <Signup />
    </Layout>
  );
};

export default Register;
