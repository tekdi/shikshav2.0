import { useMemo } from 'react';

interface UseKeywordsProps {
  contentData: any;
}

export const useKeywords = ({ contentData }: UseKeywordsProps) => {
  const keywords = useMemo(() => {
    return Array.isArray(contentData?.keywords) ? contentData.keywords : [];
  }, [contentData?.keywords]);

  const showMoreIcon = useMemo(() => {
    return keywords && keywords.length > 3;
  }, [keywords]);

  const capitalizeFirstLetter = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const displayedKeywords = useMemo(() => {
    return (
      (showMoreIcon ? keywords?.slice(0, 4) : keywords)?.map(
        capitalizeFirstLetter
      ) ?? []
    );
  }, [keywords, showMoreIcon]);

  const remainingKeywords = useMemo(() => {
    return keywords.slice(3);
  }, [keywords]);

  return {
    keywords,
    showMoreIcon,
    displayedKeywords,
    remainingKeywords,
    capitalizeFirstLetter,
  };
};
