import { post } from '@shared-lib';

export const getUserCertificateStatus = async ({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) => {
  const response = await post(
    `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/user_certificate/status/get`,
    {
      userId,
      courseId,
    },
    {
      tenantId: localStorage.getItem('tenantId') || '',
      Authorization: `Bearer ${localStorage.getItem('accToken') || ''}`,
    }
  );
  return response?.data ?? {};
};

export const createUserCertificateStatus = async ({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) => {
  const response = await post(
    `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/user_certificate/status/create`,
    {
      userId,
      courseId,
    },
    {
      tenantId: localStorage.getItem('tenantId') || '',
      Authorization: `Bearer ${localStorage.getItem('accToken') || ''}`,
    }
  );
  return response?.data ?? {};
};
