import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { trackEvent } from '@shared-lib';
import { TelemetryEventType } from '../utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';

interface UseContentActionsProps {
  identifier: string;
  contentData: any;
}

export const useContentActions = ({
  identifier,
  contentData,
}: UseContentActionsProps) => {
  const router = useRouter();

  const createTelemetryInteract = useCallback(
    (actionId: string) => {
      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const env = cleanedUrl.split('/')[0];

      return {
        context: {
          env: env,
          cdata: [],
        },
        edata: {
          id: actionId,
          name: contentData?.name,
          type: TelemetryEventType.CLICK,
          subtype: '',
          pageid: cleanedUrl,
        },
      };
    },
    [contentData]
  );

  const handleOnCLick = useCallback(() => {
    const telemetryInteract = createTelemetryInteract('Resource Link');
    telemetryFactory.interact(telemetryInteract);

    trackEvent({
      action: 'resource_open',
      category: 'user',
      label: 'Content Details Page',
    });

    window.open(contentData?.url, '_blank');
  }, [contentData, createTelemetryInteract]);

  const handlePreview = useCallback(() => {
    const telemetryInteract = createTelemetryInteract('Preview content');
    telemetryFactory.interact(telemetryInteract);

    trackEvent({
      action: 'preview_content',
      category: 'user',
      label: 'Content Details Page',
    });

    router.push(`/player/${identifier}`);
  }, [identifier, createTelemetryInteract, router]);

  const handleOnDownload = useCallback(async () => {
    const downloadLink = contentData?.downloadurl || contentData?.previewUrl;

    if (!downloadLink) {
      console.error('No valid download or preview URL available');
      return;
    }

    const telemetryInteract = createTelemetryInteract('Download content');
    telemetryFactory.interact(telemetryInteract);

    try {
      const response = await fetch(downloadLink);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = contentData?.name ?? 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      trackEvent({
        action: 'download_content',
        category: 'user',
        label: 'Content Details Page',
      });

      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [contentData, createTelemetryInteract]);

  return {
    handleOnCLick,
    handlePreview,
    handleOnDownload,
  };
};
