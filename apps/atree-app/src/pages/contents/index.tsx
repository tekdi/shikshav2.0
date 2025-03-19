'use client';

import React, { useEffect, useState } from 'react';
import { setData } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box } from '@mui/material';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

export interface ContentSearchResponse {
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
interface ListProps {}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const List: React.FC<ListProps> = () => {
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);
  const router = useRouter();
  const [subCategory, setSubCategory] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSubCategory(localStorage.getItem('subcategory'));
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      setIsLoadingChildren(false);
    };
    init();
  }, [mfe_content]);

  return (
    <Layout isLoadingChildren={isLoadingChildren}>
      <Box
        sx={{
          padding: 0,
          height: 'calc(100vh - 100px)',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Content
          {...{
            _grid: {
              size: { xs: 6, sm: 6, md: 4, lg: 3 },
            },
            handleCardClick: (content: ContentSearchResponse) =>
              router.push(`/contents/${content?.identifier}`),
            contentTabs: ['content'],
            filters: {
              filters: {
                channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                query: subCategory || '',
                // status: ['Live'],
              },
            },
            _card: {
              cardName: 'AtreeCard',
              image: atreeLogo.src,
            },
            showSearch: false,
            filterBy: true,
            showArrowback: true,
          }}
        />
      </Box>
    </Layout>
  );
};

export default List;
