// src/services/apiService.ts
export const fetchFrameworkData = async (frameworkId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${frameworkId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const frameworkData = await response.json();
    return frameworkData;
  } catch (error) {
    console.error('Error fetching framework data:', error);
    throw error; // Re-throw to let components handle errors
  }
};

export const processFrameworkData = (frameworkData: any) => {
  const frameworks = frameworkData?.result?.framework?.categories || [];
  const fdata =
    frameworks.find((item: any) => item.code === 'topic')?.terms ?? [];
  return {
    framework: fdata[0]?.identifier ?? '',
    frameworkFilter: fdata,
    frameworkData,
  };
};
