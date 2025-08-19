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
          throw new Error(
            `Failed to load ${language} translations: ${response.status} ${response.statusText}`
          );
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
          bundleKeys: Object.keys(resources || {}),
        });
        return resources;
      } catch (error) {
        console.error(`Error loading resources for ${language}:`, error);
        return null;
      }
    },
    [i18n]
  );

  const reloadResources = useCallback(
    async (language: SupportedLanguage) => {
      console.log(`Manually reloading resources for ${language}...`);
      const resources = await loadResources(language);
      if (resources && language === i18n.language) {
        setCurrentBundle(resources);
        console.log(`Resources reloaded for ${language}`);
      }
      return resources;
    },
    [loadResources, i18n.language]
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
          console.warn(
            `Failed to load resources for ${newLanguage}, trying to reload...`
          );
          // Try to reload resources
          const reloadedResources = await reloadResources(
            newLanguage as SupportedLanguage
          );
          if (!reloadedResources) {
            throw new Error(
              `Failed to load resources for ${newLanguage} after reload attempt`
            );
          }
        }

        // Update state before changing language
        updateLanguageState(newLanguage);

        // Change the language
        await i18n.changeLanguage(newLanguage);

        // Update current bundle with the new resources
        setCurrentBundle(resources);

        // Force a reload of the resources to ensure they're fresh
        await loadResources(newLanguage as SupportedLanguage);

        // Dispatch custom event to notify all components
        window.dispatchEvent(
          new CustomEvent('languageChanged', { detail: newLanguage })
        );

        // Debug: Verify the change
        console.log('Language change completed:', {
          newLanguage,
          currentLanguage: i18n.language,
          hasResources: i18n.hasResourceBundle(newLanguage, 'common'),
          resources: i18n.getResourceBundle(newLanguage, 'common'),
          htmlLang: document.documentElement.lang,
          currentBundle: resources,
        });

        return true;
      } catch (error) {
        console.error('Error changing language:', error);
        // Revert to default language on error
        await i18n.changeLanguage(DEFAULT_LANGUAGE);
        setCurrentBundle(null);
        updateLanguageState(DEFAULT_LANGUAGE);
        return false;
      }
    },
    [i18n, loadResources, updateLanguageState, reloadResources]
  );

  // Initialize translations
  useEffect(() => {
    const initializeTranslations = async () => {
      try {
        console.log('Initializing translations...');

        // Get the current language
        const currentLang =
          localStorage.getItem('selectedLanguage') ||
          i18n.language ||
          DEFAULT_LANGUAGE;
        console.log('Current language for initialization:', currentLang);

        // Load resources for both current language and English (as fallback)
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
          console.log(
            'Initialization completed with current language resources'
          );
        } else if (englishResources) {
          // Fallback to English if current language resources failed to load
          await changeLanguage(LANGUAGES.ENGLISH);
          setCurrentBundle(englishResources);
          setIsLoaded(true);
          console.log('Initialization completed with English fallback');
        } else if (retryCount < 3) {
          // Retry initialization if both attempts failed
          console.log(`Retry attempt ${retryCount + 1} for initialization`);
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

  // Monitor i18n language changes and update currentBundle accordingly
  useEffect(() => {
    const updateCurrentBundle = async () => {
      if (i18n.language && ready) {
        console.log('Updating currentBundle for language:', i18n.language);

        // Get the current bundle from i18n
        const currentBundle = i18n.getResourceBundle(i18n.language, 'common');
        if (currentBundle) {
          setCurrentBundle(currentBundle);
          console.log('CurrentBundle updated:', {
            language: i18n.language,
            keys: Object.keys(currentBundle),
            hasDigitalHubBanner: 'DIGITAL_HUB_BANNER' in currentBundle,
          });
        } else {
          // If no bundle exists, try to load it
          console.log('No bundle found, loading resources for:', i18n.language);
          const resources = await loadResources(
            i18n.language as SupportedLanguage
          );
          if (resources) {
            setCurrentBundle(resources);
          }
        }
      }
    };

    updateCurrentBundle();
  }, [i18n.language, ready, loadResources]);

  const t = useCallback(
    (key: TranslationKey) => {
      if (!mounted || !isLoaded || !ready) {
        console.log('Translation not ready:', { mounted, isLoaded, ready });
        return key;
      }

      try {
        // Get the current bundle from i18n directly
        const currentBundleFromI18n = i18n.getResourceBundle(
          i18n.language,
          'common'
        );

        // Try current bundle from i18n first
        if (currentBundleFromI18n && currentBundleFromI18n[key]) {
          console.log(
            `Translation found in i18n bundle for ${key}:`,
            currentBundleFromI18n[key]
          );
          return currentBundleFromI18n[key];
        }

        // Try our cached currentBundle
        if (currentBundle && currentBundle[key]) {
          console.log(
            `Translation found in cached bundle for ${key}:`,
            currentBundle[key]
          );
          return currentBundle[key];
        }

        // Try translation function
        const translation = translate(key);
        if (translation && translation !== key) {
          console.log(
            `Translation found via translate function for ${key}:`,
            translation
          );
          return translation;
        }

        // Try English fallback
        if (i18n.language !== LANGUAGES.ENGLISH) {
          const englishBundle = i18n.getResourceBundle(
            LANGUAGES.ENGLISH,
            'common'
          );
          if (englishBundle && englishBundle[key]) {
            console.log(
              `English fallback found for ${key}:`,
              englishBundle[key]
            );
            return englishBundle[key];
          }

          const englishTranslation = translate(key, { lng: LANGUAGES.ENGLISH });
          if (englishTranslation && englishTranslation !== key) {
            console.log(
              `English fallback via translate for ${key}:`,
              englishTranslation
            );
            return englishTranslation;
          }
        }

        // Log warning if no translation found
        console.warn(
          `No translation found for key: ${key} in language: ${i18n.language}`,
          {
            currentBundleFromI18n: !!currentBundleFromI18n,
            currentBundle: !!currentBundle,
            i18nLanguage: i18n.language,
          }
        );

        return key;
      } catch (error) {
        console.error('Translation error:', error);
        return key;
      }
    },
    [mounted, isLoaded, ready, currentBundle, i18n.language, translate]
  );

  // Force re-render when language or bundle changes
  useEffect(() => {
    console.log(
      'useAppTranslation: Language or bundle changed, forcing re-render'
    );
  }, [i18n.language, currentBundle]);

  return {
    t,
    i18n,
    ready: ready && isLoaded && mounted && !!currentBundle,
    currentLanguage: i18n.language,
    changeLanguage,
    reloadResources,
  };
};
