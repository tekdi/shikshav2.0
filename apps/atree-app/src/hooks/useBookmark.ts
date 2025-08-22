import { useState, useCallback } from 'react';
import { createBookmark, readBookmark } from '../service/content';
import { trackEvent } from '@shared-lib';
import { TelemetryEventType } from '../utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';
import { useAppTranslation } from '../utils/i18n.helper';

interface UseBookmarkProps {
  identifier: string;
  contentData: any;
}

export const useBookmark = ({ identifier, contentData }: UseBookmarkProps) => {
  const { t } = useAppTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showAlertMsg, setShowAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [openBookmarkDialog, setOpenBookmarkDialog] = useState(false);

  const checkBookmarkStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setIsBookmarked(false);
        return;
      }

      const bookmarkData = {
        userId: userId,
        entityType: 'content',
        doId: identifier,
      };

      const response = await readBookmark(bookmarkData, token);
      const isContentBookmarked =
        response?.result?.bookmarks?.some(
          (bookmark: { doId: string }) => bookmark.doId === identifier
        ) || false;
      setIsBookmarked(isContentBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      setIsBookmarked(false);
    }
  }, [identifier]);

  const handleBookmarkToggle = useCallback(async () => {
    if (isBookmarkLoading) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setOpenBookmarkDialog(true);
      return;
    }

    setIsBookmarkLoading(true);
    try {
      const action: 'add' | 'remove' = isBookmarked ? 'remove' : 'add';
      const bookmarkData = {
        userId: userId,
        entityType: 'content',
        doId: identifier,
        action,
      };

      const response = await createBookmark(bookmarkData, token);

      if (response && !response.error) {
        setIsBookmarked((prev) => !prev);

        const message = isBookmarked
          ? t('BOOKMARK_REMOVED_SUCCESS')
          : t('BOOKMARK_ADDED_SUCCESS');
        setShowAlertMsg(message);
        setAlertSeverity('success');

        setTimeout(() => {
          setShowAlertMsg('');
        }, 3000);

        trackEvent({
          action: isBookmarked ? 'remove_bookmark' : 'add_bookmark',
          category: 'user',
          label: 'Content Details Page',
        });

        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split('/')[0];

        const telemetryInteract = {
          context: {
            env: env,
            cdata: [],
          },
          edata: {
            id: isBookmarked ? 'Remove Bookmark' : 'Add Bookmark',
            name: contentData?.name,
            type: TelemetryEventType.CLICK,
            subtype: '',
            pageid: cleanedUrl,
          },
        };
        telemetryFactory.interact(telemetryInteract);
      } else {
        console.error('Bookmark operation failed:', response);
        setShowAlertMsg(t('BOOKMARK_ERROR'));
        setAlertSeverity('error');

        setTimeout(() => {
          setShowAlertMsg('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setShowAlertMsg(t('BOOKMARK_ERROR'));
      setAlertSeverity('error');

      setTimeout(() => {
        setShowAlertMsg('');
      }, 3000);
    } finally {
      setIsBookmarkLoading(false);
    }
  }, [isBookmarked, isBookmarkLoading, identifier, contentData, t]);

  const closeBookmarkDialog = useCallback(() => {
    setOpenBookmarkDialog(false);
  }, []);

  const closeAlert = useCallback(() => {
    setShowAlertMsg('');
  }, []);

  return {
    isBookmarked,
    isBookmarkLoading,
    showAlertMsg,
    alertSeverity,
    openBookmarkDialog,
    checkBookmarkStatus,
    handleBookmarkToggle,
    closeBookmarkDialog,
    closeAlert,
  };
};
