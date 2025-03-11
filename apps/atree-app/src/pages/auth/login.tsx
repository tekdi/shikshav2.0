import { Layout } from '@shared-lib';
import dynamic from 'next/dynamic';
import React from 'react';

const Login = dynamic(() => import('@LoginAtree'), {
  ssr: false,
});

const login = () => {
  return <Login />;
};

export default login;
