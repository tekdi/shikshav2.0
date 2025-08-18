import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import {
  LANGUAGE_KEYS,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from './language.constants';
import { useEffect, useState, useCallback } from 'react';

// Initialize i18next with the missing key handler and other configuration
i18next.use(initReactI18next).init({
  fallbackLng: {
    default: ['en'],
    hi: ['en'],
  },
  defaultNS: 'common',
  ns: ['common'],
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  returnEmptyString: false,
  returnNull: false,
  returnObjects: false,
  saveMissing: true,
  saveMissingTo: 'all',
  missingKeyHandler: (lng, ns, key) => {
    console.warn(
      `Missing translation key: ${key} for language: ${lng} in namespace: ${ns}`
    );
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'selectedLanguage',
  },
  // Ensure resources are loaded before rendering
  initImmediate: false,
  preload: ['en', 'hi'],
  // Load translations from public directory
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
});

type TranslationKey = keyof typeof LANGUAGE_KEYS;
type TranslationData = Record<
  string,
  Record<string, Record<TranslationKey, string>>
>;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const useAppTranslation = () => {
  const { t: translate, i18n, ready } = useTranslation('common');
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentBundle, setCurrentBundle] = useState<Record<
    string,
    string
  > | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadResources = useCallback(
    async (language: SupportedLanguage) => {
      try {
        console.log(`Attempting to load resources for ${language}...`);

        // Force reload resources even if they exist
        const response = await fetch(`/locales/${language}/common.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${language} translations`);
        }
        const resources = await response.json();

        // Remove existing bundle if any
        i18n.removeResourceBundle(language, 'common');
        // Add the fresh bundle
        i18n.addResourceBundle(language, 'common', resources, true, true);

        if (language === i18n.language) {
          setCurrentBundle(resources);
        }

        console.log(`Resources loaded for ${language}:`, {
          resources,
          hasBundle: i18n.hasResourceBundle(language, 'common'),
          bundle: i18n.getResourceBundle(language, 'common'),
        });
        return resources;
      } catch (error) {
        console.error(`Error loading resources for ${language}:`, error);
        return null;
      }
    },
    [i18n]
  );

  const updateLanguageState = useCallback(
    (newLanguage: string) => {
      try {
        localStorage.setItem('selectedLanguage', newLanguage);
        document.documentElement.lang = newLanguage;
        console.log('Language state updated:', {
          localStorage: localStorage.getItem('selectedLanguage'),
          htmlLang: document.documentElement.lang,
          i18nLanguage: i18n.language,
        });
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    },
    [i18n]
  );

  const changeLanguage = useCallback(
    async (newLanguage: string) => {
      try {
        console.log('Starting language change:', {
          newLanguage,
          currentLanguage: i18n.language,
          currentHtmlLang: document.documentElement.lang,
          savedLanguage: localStorage.getItem('selectedLanguage'),
        });

        // Validate language
        if (!SUPPORTED_LANGUAGES.includes(newLanguage as SupportedLanguage)) {
          console.warn(
            `Unsupported language: ${newLanguage}, falling back to ${DEFAULT_LANGUAGE}`
          );
          newLanguage = DEFAULT_LANGUAGE;
        }

        // Load resources for the new language first
        const resources = await loadResources(newLanguage as SupportedLanguage);
        if (!resources) {
          throw new Error(`Failed to load resources for ${newLanguage}`);
        }

        // Update state before changing language
        updateLanguageState(newLanguage);

        // Change the language
        await i18n.changeLanguage(newLanguage);
        setCurrentBundle(resources);

        // Force a reload of the resources to ensure they're fresh
        await loadResources(newLanguage as SupportedLanguage);

        // Debug: Verify the change
        console.log('Language change complete:', {
          currentLanguage: i18n.language,
          htmlLang: document.documentElement.lang,
          savedLanguage: localStorage.getItem('selectedLanguage'),
          hasBundle: i18n.hasResourceBundle(newLanguage, 'common'),
          bundle: resources,
        });

        // Reset retry count on successful change
        setRetryCount(0);

        // Dispatch a custom event to notify other components
        window.dispatchEvent(
          new CustomEvent('languageChanged', { detail: newLanguage })
        );
      } catch (error) {
        console.error('Error changing language:', error);
        // Increment retry count
        setRetryCount((prev) => prev + 1);
        // Only fallback to default language if we haven't tried too many times
        if (retryCount < 3) {
          await i18n.changeLanguage(DEFAULT_LANGUAGE);
          updateLanguageState(DEFAULT_LANGUAGE);
        }
        throw error;
      }
    },
    [i18n, loadResources, updateLanguageState, retryCount]
  );

  // Initial load of translations
  useEffect(() => {
    const initializeTranslations = async () => {
      try {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        const currentLang = savedLanguage || i18n.language || DEFAULT_LANGUAGE;

        console.log('Initializing translations:', {
          savedLanguage,
          currentLang,
          i18nLanguage: i18n.language,
          htmlLang: document.documentElement.lang,
          retryCount,
        });

        // Load both current language and English fallback
        const [currentResources, englishResources] = await Promise.all([
          loadResources(currentLang as SupportedLanguage),
          currentLang !== LANGUAGES.ENGLISH
            ? loadResources(LANGUAGES.ENGLISH)
            : null,
        ]);

        if (currentResources) {
          await changeLanguage(currentLang);
          setCurrentBundle(currentResources);
          setIsLoaded(true);
        } else if (englishResources) {
          // Fallback to English if current language resources failed to load
          await changeLanguage(LANGUAGES.ENGLISH);
          setCurrentBundle(englishResources);
          setIsLoaded(true);
        } else if (retryCount < 3) {
          // Retry initialization if both attempts failed
          setRetryCount((prev) => prev + 1);
          setIsLoaded(false);
        } else {
          console.error('Failed to load translations after multiple attempts');
          setIsLoaded(true); // Allow the app to proceed with keys as fallback
        }
      } catch (error) {
        console.error('Error initializing translations:', error);
        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);
          setIsLoaded(false);
        } else {
          setIsLoaded(true); // Allow the app to proceed with keys as fallback
        }
      }
    };

    if (!isLoaded) {
      initializeTranslations();
    }
  }, [isLoaded, i18n, loadResources, changeLanguage, retryCount]);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle language sync across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedLanguage' && event.newValue) {
        const newLanguage = event.newValue;
        changeLanguage(newLanguage).catch(console.error);
      }
    };

    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail;
      if (newLanguage !== i18n.language) {
        changeLanguage(newLanguage).catch(console.error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'languageChanged' as any,
      handleLanguageChange as any
    );
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'languageChanged' as any,
        handleLanguageChange as any
      );
    };
  }, [i18n, changeLanguage]);

  // Monitor i18n language changes
  useEffect(() => {
    const currentSavedLanguage = localStorage.getItem('selectedLanguage');
    if (i18n.language && i18n.language !== currentSavedLanguage) {
      console.log('Language mismatch detected:', {
        i18nLanguage: i18n.language,
        savedLanguage: currentSavedLanguage,
        htmlLang: document.documentElement.lang,
        retryCount,
      });
      if (retryCount < 3) {
        changeLanguage(i18n.language).catch(console.error);
      }
    }
  }, [i18n.language, changeLanguage, retryCount]);

  const t = (key: TranslationKey) => {
    if (!mounted || !isLoaded || !ready || !currentBundle) {
      return key;
    }

    try {
      // Try current bundle first
      if (currentBundle[key]) {
        return currentBundle[key];
      }

      // Try translation function
      const translation = translate(key);
      if (translation && translation !== key) {
        return translation;
      }

      // Try English fallback
      if (i18n.language !== LANGUAGES.ENGLISH) {
        const englishBundle = i18n.getResourceBundle(
          LANGUAGES.ENGLISH,
          'common'
        );
        if (englishBundle && englishBundle[key]) {
          return englishBundle[key];
        }

        const englishTranslation = translate(key, { lng: LANGUAGES.ENGLISH });
        if (englishTranslation && englishTranslation !== key) {
          return englishTranslation;
        }
      }

      // Log warning if no translation found
      console.warn(
        `No translation found for key: ${key} in language: ${i18n.language}`,
        {
          currentBundle,
          englishBundle: i18n.getResourceBundle(LANGUAGES.ENGLISH, 'common'),
        }
      );

      return key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  return {
    t,
    i18n,
    ready: ready && isLoaded && mounted && !!currentBundle,
    currentLanguage: i18n.language,
    changeLanguage,
  };
};
