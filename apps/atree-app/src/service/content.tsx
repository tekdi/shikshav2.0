import { get, post } from '@shared-lib';
interface LoginParams {
  email: string;
  password: string;
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
