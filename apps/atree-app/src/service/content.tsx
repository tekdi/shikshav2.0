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
  mobile?: string;
  tenantCohortRoleMapping: TenantCohortRoleMapping[];
}
interface AuthParams {
  token: string;
}
interface DeleteParams {
  token: string;
  userId: string;
}

// Bookmark related interfaces
interface BookmarkParams {
  userId: string;
  entityType: string;
  doId: string;
  action: 'add' | 'remove';
}

interface BookmarkReadParams {
  userId: string;
  entityType: string;
  doId: string;
}

interface BookmarkResponse {
  id: string;
  ver: string;
  ts: string;
  params: {
    resmsgid: string;
    status: string;
    error: any;
    errmsg: any;
  };
  responseCode: string;
  result: {
    bookmarks: Array<{
      id: string;
      userId: string;
      entityType: string;
      doId: string;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: any;
    }>;
    totalCount: number;
  };
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
    mobile,
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
      ...(mobile && { mobile }),
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
  userId,
}: DeleteParams): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/user/update/${userId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    tenantid: '3a849655-30f6-4c2b-8707-315f1ed64fbd',
  };
  const data = {
    userData: {
      status: 'archived',
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

// Bookmark API functions
export const createBookmark = async (
  bookmarkData: BookmarkParams,
  token: string
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_ATREE_LOGIN_URL}/interface/v1/todo/bookmark/create`;
  try {
    const response = await axios.post(apiUrl, bookmarkData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return error;
  }
};

export const readBookmark = async (
  bookmarkData: BookmarkReadParams,
  token: string
): Promise<BookmarkResponse> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/todo/bookmark/read?userId=${bookmarkData.userId}&entityType=${bookmarkData.entityType}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error reading bookmark status:', error);
    return {
      id: '',
      ver: '',
      ts: '',
      params: {
        resmsgid: '',
        status: 'failed',
        error: error,
        errmsg: 'Error reading bookmark status',
      },
      responseCode: 'ERROR',
      result: {
        bookmarks: [],
        totalCount: 0,
      },
    };
  }
};
