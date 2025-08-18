import { Typography, Switch, Box } from '@mui/material';
import { useAppTranslation } from '../utils/i18n.helper';
import {
  LANGUAGES,
  LANGUAGE_LABELS,
  DEFAULT_LANGUAGE,
} from '../utils/language.constants';
import { useEffect, useState } from 'react';

const LanguageSwitch = () => {
  const { currentLanguage, changeLanguage, i18n, t } = useAppTranslation();
  const [isHindi, setIsHindi] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force reload translations when language changes
  useEffect(() => {
    const reloadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${i18n.language}/common.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${i18n.language} translations`);
        }
        const resources = await response.json();
        i18n.removeResourceBundle(i18n.language, 'common');
        i18n.addResourceBundle(i18n.language, 'common', resources, true, true);
        setForceUpdate((prev) => prev + 1);
      } catch (error) {
        console.error('Error reloading translations:', error);
      }
    };

    reloadTranslations();
  }, [i18n.language, i18n]);

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        console.log('Language initialization:', {
          currentLanguage,
          savedLanguage,
          hasEnglishBundle: i18n.hasResourceBundle(LANGUAGES.ENGLISH, 'common'),
          hasHindiBundle: i18n.hasResourceBundle(LANGUAGES.HINDI, 'common'),
          htmlLang: document.documentElement.lang,
        });

        // If there's a saved language and it's different from current, change it
        if (savedLanguage && savedLanguage !== currentLanguage) {
          await changeLanguage(savedLanguage);
        } else if (!savedLanguage) {
          // Set default language if none is saved
          await changeLanguage(DEFAULT_LANGUAGE);
        }

        setIsHindi(savedLanguage === LANGUAGES.HINDI);
      } catch (error) {
        console.error('Error initializing language:', error);
        // Default to English on error
        setIsHindi(false);
        await changeLanguage(DEFAULT_LANGUAGE);
      }
    };

    initializeLanguage();
  }, [currentLanguage, changeLanguage, i18n]);

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setIsChanging(true);
      const newLanguage = event.target.checked
        ? LANGUAGES.HINDI
        : LANGUAGES.ENGLISH;
      console.log('Language change requested:', {
        newLanguage,
        currentLanguage,
        hasResources: i18n.hasResourceBundle(newLanguage, 'common'),
        htmlLang: document.documentElement.lang,
      });

      // Change language first
      await changeLanguage(newLanguage);

      // Update UI state after successful change
      setIsHindi(event.target.checked);

      // Force reload translations
      const response = await fetch(`/locales/${newLanguage}/common.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${newLanguage} translations`);
      }
      const resources = await response.json();
      i18n.removeResourceBundle(newLanguage, 'common');
      i18n.addResourceBundle(newLanguage, 'common', resources, true, true);

      // Verify the change
      console.log('Language change completed:', {
        newLanguage,
        currentLanguage: i18n.language,
        hasResources: i18n.hasResourceBundle(newLanguage, 'common'),
        resources: i18n.getResourceBundle(newLanguage, 'common'),
        htmlLang: document.documentElement.lang,
      });

      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent('translationsReloaded', { detail: newLanguage })
      );
    } catch (error) {
      console.error('Error changing language:', error);
      // Revert UI state on error
      setIsHindi(!event.target.checked);
      await changeLanguage(DEFAULT_LANGUAGE);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{t('LANGUAGE')}:</Typography>
      <Typography>EN</Typography>
      <Switch
        checked={isHindi}
        onChange={handleLanguageChange}
        disabled={isChanging}
        color="primary"
      />
      <Typography>हिंदी</Typography>
    </Box>
  );
};

export default LanguageSwitch;
