import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    const accToken = localStorage.getItem('accToken');

    if (!tenantId || !accToken) {
      const redirectUrl = encodeURIComponent(window.location.href);
      localStorage.setItem('postLoginRedirect', redirectUrl);
      router.replace(`/login`);
    }
  }, []);
};
