import axios, { AxiosRequestConfig } from 'axios';

// Define the payload
const data = {
  request: {
    filters: {
      primaryCategory: [
        'Collection',
        'Resource',
        'Content Playlist',
        'Course',
        'Course Assessment',
        'Digital Textbook',
        'eTextbook',
        'Explanation Content',
        'Learning Resource',
        'Lesson Plan Unit',
        'Practice Question Set',
        'Teacher Resource',
        'Textbook Unit',
        'LessonPlan',
        'FocusSpot',
        'Learning Outcome Definition',
        'Curiosity Questions',
        'MarkingSchemeRubric',
        'ExplanationResource',
        'ExperientialResource',
        'Practice Resource',
        'TVLesson',
        'Course Unit',
        'Exam Question',
        'Question paper',
      ],
    },
  },
};
// let searchApiUrl: string;

// if (typeof window !== 'undefined') {
//   searchApiUrl =
//     import.meta.env.VITE_SSUNBIRD_BASE_URL || 'https://default-search-api.com';
// } else {
//   searchApiUrl =
//     process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL ||
//     'https://default-search-api.com';
// }

// Configure Axios request
export const ContentSearch = async (): Promise<any> => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl =
      import.meta.env.VITE_PUBLIC_SSUNBIRD_BASE_URL ||
      'https://default-search-api.com';

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
