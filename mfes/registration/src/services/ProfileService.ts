import axios from 'axios';
import { get, patch } from '@shared-lib';
interface MyCourseDetailsProps {
  token: string | null;
  userId: string | null;
}
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

export const editEditUser = async (
  userId?: string | string[],
  userDetails?: object
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/update/${userId}`;
  try {
    const response = await patch(apiUrl, userDetails);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    throw error;
  }
};

export const getUserDetails = async (
  userId?: string | string[],
  fieldValue?: boolean
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/read/${userId}`;
  apiUrl = fieldValue ? `${apiUrl}?fieldvalue=true` : apiUrl;

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};

export const getUserByToken = async (token: string): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/auth`;
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.result;
  } catch (error) {
    console.error('error in fetching user details', error);
    throw error;
  }
};

export const myCourseDetails = async ({
  token,
  userId,
}: MyCourseDetailsProps): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/interface/v1/tracking/user_certificate/status/search`;
  try {
    const response = await axios.post(
      apiUrl,
      {
        filters: {
          userId: userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          tenantId: localStorage.getItem('tenantId') || '',
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const renderCertificate = async (
  credentialId: string
): Promise<string> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/interface/v1/tracking/certificate/render`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        credentialId,
        templateId: 'cm99rsd380000pg0iift4she7', // You may make this dynamic if needed
      },
      {
        headers: {
          tenantId: localStorage.getItem('tenantId') || '',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error rendering certificate:', error);
    throw error;
  }
};
