import axios, { AxiosRequestConfig } from 'axios';

// Define the payload
const data = {
  request: {
    filters: {},
  },
};

export const ContentSearch = async (): Promise<any> => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl = 'https://default-search-api.com';

    console.log('Search API URL:', searchApiUrl);

    // Axios request configuration
    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${searchApiUrl}/api/content/v1/search`,
      data: data,
    };

    // Execute the request
    const response = await axios.request(config);
    const res = response?.data?.result?.content;

    console.log('Search Response:', res);
    return res;
  } catch (error) {
    console.error('Error in ContentSearch:', error);
    throw error; // Re-throw the error to the caller for better handling
  }
};
