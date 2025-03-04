import axios from 'axios';
import { post } from '@shared-lib';

interface LoginParams {
  email: string;
  otp: string;
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

interface RefreshParams {
  refresh_token: string;
}

export const login = async ({ username, password }: Login): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/auth/login`;

  try {
    const response = await post(apiUrl, { username, password });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const refresh = async ({
  refresh_token,
}: RefreshParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/auth/refresh`;
  try {
    const response = await post(apiUrl, { refresh_token });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const logout = async (refreshToken: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/auth/logout`;
  try {
    const response = await post(apiUrl, { refresh_token: refreshToken });
    return response;
  } catch (error) {
    console.error('error in logout', error);
    throw error;
  }
};

export const resetPassword = async (newPassword: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/reset-password`;
  try {
    const response = await post(apiUrl, { newPassword });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const forgotPasswordAPI = async (
  newPassword: any,
  token: any
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/forgot-password`;
  try {
    const response = await post(apiUrl, { newPassword, token });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const resetPasswordLink = async (username: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/password-reset-link`;
  try {
    let redirectUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || '';
    if (redirectUrl === '' && typeof window !== 'undefined') {
      redirectUrl = window.location.origin;
    }
    const response = await post(apiUrl, { username, redirectUrl });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const getUserId = async (): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/auth`;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching user details', error);
    throw error;
  }
};

// Atree login API

export const signin = async ({ email, otp }: LoginParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/account/login`;

  try {
    const response = await post(apiUrl, { username: email, password: otp });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
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
