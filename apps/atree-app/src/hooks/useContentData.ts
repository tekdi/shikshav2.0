import { useState, useCallback } from 'react';
import { getContentDetails } from '../service/content';
import { ContentSearch } from '@shared-lib';
import { TelemetryEventType } from '../utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';

interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  posterImage: string;
  contentType: string;
  mimeType: string;
  author: string;
  keywords: string[];
  year: string;
  license: string;
  description: string;
  publisher: string;
  url: string;
  previewUrl: string;
  downloadurl: string;
  image?: string;
  appicon?: string;
  access?: string;
}

interface UseContentDataProps {
  identifier: string;
  onBookmarkStatusCheck: () => Promise<void>;
}

export const useContentData = ({
  identifier,
  onBookmarkStatusCheck,
}: UseContentDataProps) => {
  const [contentData, setContentData] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedContent, setRelatedContent] = useState<any>([]);

  const mapContentItem = (item: any): ContentItem => ({
    name: item.name ?? '',
    gradeLevel: item.gradeLevel ?? [],
    language: item.language ?? [],
    artifactUrl: item.artifactUrl ?? '',
    identifier: item.identifier ?? '',
    posterImage: item.posterImage ?? '',
    contentType: item.contentType ?? '',
    mimeType: item.mimeType ?? '',
    author: item.author ?? '',
    keywords: item.keywords ?? [],
    year: item.year ?? '',
    license: item.license ?? '',
    description: item.description ?? '',
    publisher: item.publisher ?? '',
    url: item.url ?? '',
    previewUrl: item.previewUrl ?? '',
    downloadurl: item.downloadurl ?? '',
  });

  const fetchRelatedContent = async (result: any, updatedFilters: any) => {
    const cleanKeywords = (
      result?.keywords?.filter((item: any) => item) ?? []
    ).slice(0, 4);
    const queryString = cleanKeywords;

    try {
      const searchFilters = {
        ...updatedFilters,
        keywords: queryString,
      };
      const keywordFilteredResults = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: searchFilters,
      });
      const filtered =
        keywordFilteredResults?.result?.content?.filter(
          (item: any) => item.identifier !== result.identifier
        ) ?? [];

      if (filtered.length > 0) {
        return filtered.map(mapContentItem);
      }
    } catch (error) {
      console.error(`Search failed for keyword ${cleanKeywords}:`, error);
    }
    return [];
  };

  const sendTelemetry = (result: any) => {
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `Content page`,
        name: result?.name,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const fetchContent = useCallback(
    async (updatedFilters: any) => {
      setIsLoading(true);
      try {
        const {
          result: { content: result },
        } = await getContentDetails(identifier);

        if (result && typeof result === 'object') {
          setContentData(result);
          localStorage.setItem('contentData', result?.name);

          sendTelemetry(result);
          await onBookmarkStatusCheck();
        }

        const relatedContentTemp = await fetchRelatedContent(
          result,
          updatedFilters
        );
        setRelatedContent(relatedContentTemp);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [identifier, onBookmarkStatusCheck]
  );

  const updateRelatedContent = useCallback(
    async (keyword: string) => {
      try {
        const keywordFilteredResults = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          query: keyword,
        });

        const filteredContent =
          keywordFilteredResults?.result?.content?.filter(
            (item: any) => item.identifier !== identifier
          ) ?? [];

        setRelatedContent(filteredContent.map(mapContentItem));
      } catch (error) {
        console.error(`Search failed for keyword ${keyword}:`, error);
      }
    },
    [identifier]
  );

  return {
    contentData,
    isLoading,
    relatedContent,
    fetchContent,
    updateRelatedContent,
  };
};
