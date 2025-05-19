declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  } else {
    console.warn('gtag not initialized yet');
  }
};

export const trackPageView = (pageTitle: string) => {
  trackEvent({
    category: 'Page Interaction',
    action: 'Page View',
    label: pageTitle,
  });
};

export const trackContentClick = (contentId: string, contentType: string) => {
  trackEvent({
    category: 'Content Interaction',
    action: 'Content Click',
    label: `${contentType} - ${contentId}`,
  });
};

export const trackFilterApplied = (filterType: string, filterValue: string) => {
  trackEvent({
    category: 'Filter Interaction',
    action: 'Filter Applied',
    label: `${filterType}: ${filterValue}`,
  });
};

export const trackAuthAttempt = (authType: 'login' | 'signup') => {
  trackEvent({
    category: 'Authentication',
    action: 'Auth Attempt',
    label: authType,
  });
};
