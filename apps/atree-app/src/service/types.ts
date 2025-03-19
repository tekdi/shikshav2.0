export interface ContentSearchResult {
  copyright?: string;

  keywords?: string[];
  subject?: string[];
  channel?: string;
  downloadUrl?: string;
  organisation?: string[];
  language?: string[];
  mimeType?: string;

  leafNodes?: string[];
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

  mediaType?: string;
  lastPublishedBy?: string;
  version?: number;
  license?: string;
  size?: number;
  name?: string;
  attributions?: string[];
  status?: string;
  code?: string;

  description?: string;
  posterImage?: string;

  contentDisposition?: string;
  additionalCategories?: string[];
  createdFor?: string[];
  creator?: string;

  framework?: string;
  depth?: number;

  leafNodesCount?: number;

  resourceType?: string;
  node_id?: number;
  topic: string | string[];
  subTopic: string | string[];
  reader?: string;
}
