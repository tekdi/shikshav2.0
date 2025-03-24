import { get, post } from '@shared-lib';
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
