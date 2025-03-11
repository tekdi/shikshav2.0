import axios from 'axios';
import { post } from '@shared-lib';

interface LoginParams {
  email: string;
  password: string;
}
interface Login {
  username: string;
  password: string;
}
interface CreateUserParams {
  username: string;
  password: string;
  gender: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

// Atree login API

export const signin = async ({
  email,
  password,
}: LoginParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/account/login`;

  try {
    const response = await post(apiUrl, {
      username: email,
      password: password,
    });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    // throw error;
    return error;
  }
};

export const createUser = async (payload: CreateUserParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/account/create`;

  const { firstName, lastName, username, password } = payload; // Extract values from payload

  try {
    const response = await post(apiUrl, {
      username: username, // Ensure correct field name
      password: password,
      gender: 'male',
      firstName: firstName,
      lastName: lastName,
      mobile: '9877297629',
    });

    return response?.data;
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};
