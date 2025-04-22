import { get, post } from '@shared-lib';
import axios from 'axios';
interface LoginParams {
  email: string;
  password: string;
}

interface TenantCohortRoleMapping {
  tenantId: string;
  roleId: string;
}
interface CreateUserParams {
  username: string;
  password: string;
  gender: string;
  firstName: string;
  lastName: string;
  tenantCohortRoleMapping: TenantCohortRoleMapping[];
}
interface AuthParams {
  token: string;
}
export const getContentDetails = async (
  identifier?: string | string[]
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/content/v1/read/${identifier}`;

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
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
export const getUserAuthInfo = async ({ token }: AuthParams): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/user/auth`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(apiUrl, { headers });

    return response?.data;
  } catch (error) {
    console.error('Error fetching user auth info:', error);
    return error;
  }
};

export const createUser = async (payload: CreateUserParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/account/create`;

  const {
    firstName,
    lastName,
    username,
    password,
    gender,
    tenantCohortRoleMapping,
  } = payload; // Extract values from payload

  try {
    const response = await post(apiUrl, {
      username: username, // Ensure correct field name
      password: password,
      gender: gender,
      firstName: firstName,
      lastName: lastName,
      tenantCohortRoleMapping,
    });

    return response?.data;
  } catch (error) {
    console.error('Error in login:', error);
    // throw error;
    return error;
  }
};

export const deleteUserAccount = async ({
  token,
}: AuthParams): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/user/auth`;
  const headers = {
    Authorization: `Bearer ${token}`,
    tenantid: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
  };
  const data = {
    userData: {
      status: 'active',
      reason: 'Health Issue',
    },
  };
  try {
    const response = await axios.patch(apiUrl, data, { headers });

    return response?.data;
  } catch (error) {
    console.error('Error fetching user auth info:', error);
    return error;
  }
};
