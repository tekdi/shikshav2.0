// Create a new file lib/frameworkCache.ts
let frameworkCache: any = null;
let fetchPromise: Promise<any> | null = null;

export const getFrameworkData = async () => {
  if (frameworkCache) return frameworkCache;
  if (fetchPromise) return await fetchPromise;

  fetchPromise = fetch(
    `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`
  ).then(async (response) => {
    const data = await response.json();
    frameworkCache = data;
    return data;
  });

  return await fetchPromise;
};
