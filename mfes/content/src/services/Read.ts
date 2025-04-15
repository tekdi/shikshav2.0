import { URL_CONFIG } from '../utils/url.config';
import { get } from '@shared-lib';
interface ContentSearchResponse {
  ownershipType?: string[];
  publish_type?: string;
  copyright?: string;
  se_gradeLevelIds?: string[];
  keywords?: string[];
  subject?: string[];
  targetMediumIds?: string[];
  channel?: string;
  downloadUrl?: string;
  organisation?: string[];
  language?: string[];
  mimeType?: string;
  variants?: {
    spine?: {
      ecarUrl?: string;
      size?: string;
    };
    online?: {
      ecarUrl?: string;
      size?: string;
    };
  };
  leafNodes?: string[];
  targetGradeLevelIds?: string[];
  objectType?: string;
  se_mediums?: string[];
  appIcon?: string;
  primaryCategory?: string;
  contentEncoding?: string;
  lockKey?: string;
  generateDIALCodes?: string;
  totalCompressedSize?: number;
  mimeTypesCount?: Record<string, number>;
  contentType?: string;
  se_gradeLevels?: string[];
  trackable?: {
    enabled?: string;
    autoBatch?: string;
  };
  identifier?: string;
  audience?: string[];
  se_boardIds?: string[];
  subjectIds?: string[];
  toc_url?: string;
  visibility?: string;
  contentTypesCount?: Record<string, number>;
  author?: string;
  consumerId?: string;
  childNodes?: string[];
  discussionForum?: {
    enabled?: string;
  };
  mediaType?: string;
  osId?: string;
  graph_id?: string;
  nodeType?: string;
  lastPublishedBy?: string;
  version?: number;
  se_subjects?: string[];
  license?: string;
  size?: number;
  lastPublishedOn?: string;
  name?: string;
  attributions?: string[];
  targetBoardIds?: string[];
  status?: string;
  code?: string;
  publishError?: string | null;
  credentials?: {
    enabled?: string;
  };
  prevStatus?: string;
  description?: string;
  posterImage?: string;
  idealScreenSize?: string;
  createdOn?: string;
  se_boards?: string[];
  targetSubjectIds?: string[];
  se_mediumIds?: string[];
  copyrightYear?: number;
  contentDisposition?: string;
  additionalCategories?: string[];
  lastUpdatedOn?: string;
  dialcodeRequired?: string;
  createdFor?: string[];
  creator?: string;
  os?: string[];
  se_subjectIds?: string[];
  se_FWIds?: string[];
  targetFWIds?: string[];
  pkgVersion?: number;
  versionKey?: string;
  migrationVersion?: number;
  idealScreenDensity?: string;
  framework?: string;
  depth?: number;
  s3Key?: string;
  lastSubmittedOn?: string;
  createdBy?: string;
  compatibilityLevel?: number;
  leafNodesCount?: number;
  userConsent?: string;
  resourceType?: string;
  node_id?: number;
}
// Define the payload

export const contentReadAPI = async (doId: string) => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl = process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL;
    if (!searchApiUrl) {
      throw new Error('Search API URL environment variable is not configured');
    }

    // Execute the request
    const response = await get(
      `${searchApiUrl}/interface/v1/action/content/v3/read/${doId}`,
      {
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('accToken') || ''}`,
      }
    );
    const res = response?.data?.result?.content;

    return res;
  } catch (error) {
    console.error('Error in ContentSearch:', error);
    throw error;
  }
};

export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.CONTENT_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.CONTENT_GET;
    const LICENSE_DETAILS = URL_CONFIG.PARAMS.LICENSE_DETAILS;
    const MODE = 'edit';
    const response = await get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`,
      {
        tenantId: localStorage.getItem('tenantId') ?? '',
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJYdHNsV2VDaHhuQ0U5Q2xrclpZeVZvTUw4eFhhTmoyN0NlZG9iVnZLalVJIn0.eyJleHAiOjE3NDQ3MDQwMjEsImlhdCI6MTc0NDYxNzYyMSwianRpIjoiYzgwMmMzNjAtNjY3OS00MzAxLWE0OTItNmZmYzRlYTBiYjBhIiwiaXNzIjoiaHR0cHM6Ly9zYWFzLWRldi1rZXljbG9hay50ZWtkaW5leHQuY29tL2F1dGgvcmVhbG1zL3NoaWtzaGEiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMmM2MzM1MGEtZjIyZS00YmEyLTg0MWMtMWQ3NGI1ODc2YjQxIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpa3NoYSIsInNlc3Npb25fc3RhdGUiOiJhMTVjZTJlMi1jOTcwLTQ3Y2MtYTA5OC1hMDQ5NzljMjQwOTAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMyIsImh0dHBzOi8vd3d3LnNuYWlsbmV0d29yay5vcmciLCJodHRwczovL3NhYXMtZGV2LWtleWNsb2FrLnRla2RpbmV4dC5jb20iLCIqIiwiaHR0cDovL2xvY2FsaG9zdDo0MTIwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1wcmF0aGFtIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIHByYXRoYW0tcm9sZSIsInNpZCI6ImExNWNlMmUyLWM5NzAtNDdjYy1hMDk4LWEwNDk3OWMyNDA5MCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6ImxlYXJuZXIgZGV2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGVhcm5lcl9zYWFzZGV2IiwidXNlcl9yb2xlcyI6IkxlYXJuZXIiLCJnaXZlbl9uYW1lIjoibGVhcm5lciIsImZhbWlseV9uYW1lIjoiZGV2In0.KOU6ySl_plYebspqbC8N8StMeIby_qbt8Ej3Yte3Dq-Afb_pq2lAPsUzjtfZunVZ9fwJLVVRra6ykFEPgCXBpH_TBZYdsJKGAhll9tYQHmACQQ0TPQJJYBmK7KtZX5OVyTyC8_1L1O0opSKBf7sW41XiRw_5Qd4WdGfQnSGQzafhK5t9FnIHPlqyjFW1Pei-4z6uJBoNcy4CxcFYoaRRlGVCl3DyV01pPsoay74Y1tDeLcT9igSOgqMVb-xqJTs2hLBmtkxO2Xu6pif6R6Ej-FSWLEA5sfe3xdbtNMzr_FszwNBdoEbdZevgbU6ur5y-eoTG1nEuiWAxRyuSN07UWw`,
      }
    );
    console.log('response =====>', response);
    return response?.data?.result?.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};
