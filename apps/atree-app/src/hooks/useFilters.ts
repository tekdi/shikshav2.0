import { useState, useCallback } from 'react';
import { trackEvent } from '@shared-lib';

export const useFilters = (fetchContent: (filters: any) => void) => {
  const [filters, setFilters] = useState<any>({
    request: {
      filters: {},
      offset: 0,
      limit: 5,
    },
  });

  const handleApplyFilters = useCallback(
    async (selectedValues: any) => {
      trackEvent({
        action: 'filter_apply',
        category: 'user',
        label: 'Home Page',
      });

      const { offset, limit, ...filters } = selectedValues;

      setFilters((prevFilters: any) => {
        // Create a new filters object, preserving previous filters
        let cleanedFilters = {
          ...prevFilters.request.filters,
          ...Object.fromEntries(
            Object.entries(filters).filter(
              ([key, value]) => Array.isArray(value) && value.length > 0
            )
          ),
        };

        if (!filters.mimeType || filters.mimeType.length === 0) {
          delete cleanedFilters.mimeType;
        }
        if (!filters.resource || filters.resource.length === 0) {
          delete cleanedFilters.resource;
        }

        const newFilters = {
          request: {
            filters: cleanedFilters,
            offset: offset ?? prevFilters.request.offset ?? 0,
            limit: limit ?? prevFilters.request.limit ?? 5,
          },
        };

        fetchContent(newFilters.request.filters);
        return newFilters;
      });
    },
    [fetchContent]
  );

  return {
    filters,
    handleApplyFilters,
  };
};
