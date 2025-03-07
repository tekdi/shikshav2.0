import { post, get } from '@shared-lib';
import axios from 'axios';
interface LoginParams {
  username: string;
  password: string;
}
export const getToken = async ({ username, password }: LoginParams) => {
  const data = new URLSearchParams({
    client_id: `${process.env.NEXT_PUBLIC_CLIENT_ID}`,
    client_secret: `${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
    grant_type: `${process.env.NEXT_PUBLIC_GRANT_TYPE}`,
    username: username,
    password: password,
  });

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_LOGIN_BASE_URL}${process.env.NEXT_PUBLIC_LOGIN_PATH}`,
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response?.data;
  } catch (error: any) {
    console.log(error);
    return error?.response?.data?.error_description;
  }
};

interface RefreshParams {
  refresh_token: string;
}

export const login = async ({
  username,
  password,
}: LoginParams): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/auth/login`;

  try {
    const response = await post(apiUrl, { username, password });
    const response2 = await axios.get(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/auth`,
      {
        headers: {
          Authorization: `Bearer ${response?.data?.result?.access_token}`,
        },
        withCredentials: true,
      }
    );
    return { ...response?.data, authUser: response2?.data?.result };
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const refresh = async ({
  refresh_token,
}: RefreshParams): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/auth/refresh`;
  try {
    const response = await post(apiUrl, { refresh_token });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const logout = async (refreshToken: string): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/auth/logout`;
  try {
    const response = await post(apiUrl, { refresh_token: refreshToken });
    return response;
  } catch (error) {
    console.error('error in logout', error);
    throw error;
  }
};

export const resetPassword = async (newPassword: any): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/reset-password`;
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
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/forgot-password`;
  try {
    const response = await post(apiUrl, { newPassword, token });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const resetPasswordLink = async (username: any): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/password-reset-link`;
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

// export const successfulNotification = async (
//   isQueue:boolean,
//   context: any,
//   key: any,
//   email: any
// ): Promise<any> => {
//   const apiUrl: string =   `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/notification/send`;
//   try {
//     const response = await post(apiUrl, { isQueue, context, key, email });
//     console.log(email);
//     return response?.data;
//   } catch (error) {
//     console.error('error in reset', error);
//     throw error;
//   }
// };
