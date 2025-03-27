import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

const useHandleCardClick = () => {
  const router = useRouter();
  const [consumedContent, setConsumedContent] = useState<string[]>([]);

  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedContent = localStorage.getItem('consumedContent');
      setConsumedContent(storedContent ? JSON.parse(storedContent) : []);
    }
  }, []);
  const handleCardClick = useCallback(
    (content: { identifier: string }) => {
      if (typeof window === 'undefined') return;
      if (consumedContent.length < 3) {
        router.push(`/contents/${content?.identifier}`);

        setConsumedContent((prev) => {
          const updatedContent = [...prev, content?.identifier];
          localStorage.setItem(
            'consumedContent',
            JSON.stringify(updatedContent)
          );
          return updatedContent;
        });
      } else if (!localStorage.getItem('token')) {
        setOpenMessageDialog(true);
        localStorage.removeItem('consumedContent');
      } else {
        router.push(`/contents/${content?.identifier}`);
      }
    },
    [router, consumedContent]
  );

  return { handleCardClick, openMessageDialog, setOpenMessageDialog };
};

export default useHandleCardClick;
