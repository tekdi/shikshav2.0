import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { useAppTranslation } from '../utils/i18n.helper';
import { LANGUAGES } from '../utils/language.constants';

const LanguageDebugger: React.FC = () => {
  const { t, i18n, ready, currentLanguage, changeLanguage, reloadResources } =
    useAppTranslation();
  const [mounted, setMounted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [debugInfo, setDebugInfo] = useState({
    currentLanguage: '',
    htmlLang: '',
    localStorage: '',
    i18nReady: false,
    hasResources: false,
    updateCount: 0,
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateDebugInfo = () => {
      setDebugInfo((prev) => ({
        currentLanguage: i18n.language || 'unknown',
        htmlLang: document.documentElement.lang || 'unknown',
        localStorage: localStorage.getItem('selectedLanguage') || 'not set',
        i18nReady: ready,
        hasResources: i18n.hasResourceBundle(i18n.language, 'common'),
        updateCount: prev.updateCount + 1,
      }));
    };

    updateDebugInfo();

    // Listen for language changes
    const handleLanguageChange = () => {
      console.log('LanguageDebugger: Language change detected');
      updateDebugInfo();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedLanguage') {
        console.log(
          'LanguageDebugger: Storage change detected:',
          event.newValue
        );
        updateDebugInfo();
      }
    };

    window.addEventListener(
      'languageChanged' as any,
      handleLanguageChange as any
    );
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(
        'languageChanged' as any,
        handleLanguageChange as any
      );
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [i18n, ready, mounted]);

  const handleTestLanguageChange = async (language: string) => {
    console.log('Testing language change to:', language);
    try {
      await changeLanguage(language);
      console.log('Language change test completed');
    } catch (error) {
      console.error('Language change test failed:', error);
    }
  };

  const handleReloadResources = async () => {
    console.log('Reloading resources for current language:', i18n.language);
    try {
      await reloadResources(i18n.language as any);
      console.log('Resources reloaded successfully');
    } catch (error) {
      console.error('Failed to reload resources:', error);
    }
  };

  const handleSyncCurrentBundle = () => {
    console.log('Manually syncing currentBundle with i18n language...');
    const currentBundleFromI18n = i18n.getResourceBundle(
      i18n.language,
      'common'
    );
    console.log('Current bundle from i18n:', {
      language: i18n.language,
      bundle: currentBundleFromI18n,
      keys: Object.keys(currentBundleFromI18n || {}),
    });
    setForceUpdate((prev) => prev + 1);
  };

  const handleRefreshTranslationHook = () => {
    console.log('Manually refreshing translation hook...');
    setForceUpdate((prev) => prev + 1);
  };

  const handleForceHindiChange = async () => {
    console.log('Force changing to Hindi with resource loading...');
    try {
      // First, load the Hindi resources
      const response = await fetch('/locales/hi/common.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch Hindi resources: ${response.status}`);
      }

      const resources = await response.json();
      console.log('Hindi resources loaded for force change:', {
        keys: Object.keys(resources),
        hasDigitalHubBanner: 'DIGITAL_HUB_BANNER' in resources,
      });

      // Add resources to i18n
      i18n.addResourceBundle('hi', 'common', resources, true, true);

      // Change language
      await i18n.changeLanguage('hi');

      // Update localStorage
      localStorage.setItem('selectedLanguage', 'hi');

      // Update HTML lang attribute
      document.documentElement.lang = 'hi';

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent('languageChanged', { detail: 'hi' })
      );

      console.log('Force Hindi change completed');

      // Force a re-render
      setDebugInfo((prev) => ({ ...prev, updateCount: prev.updateCount + 1 }));
    } catch (error) {
      console.error('Error in force Hindi change:', error);
    }
  };

  const handleTestCurrentResources = async () => {
    console.log('Testing current language resources...');
    try {
      const currentLang = i18n.language;
      console.log('Current language:', currentLang);

      const response = await fetch(`/locales/${currentLang}/common.json`);
      console.log('Current resource fetch response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const resources = await response.json();
        console.log('Current resources loaded:', {
          keys: Object.keys(resources),
          hasDigitalHubBanner: 'DIGITAL_HUB_BANNER' in resources,
          digitalHubBannerValue: resources.DIGITAL_HUB_BANNER,
          totalKeys: Object.keys(resources).length,
        });

        // Check what's in i18n
        const bundle = i18n.getResourceBundle(currentLang, 'common');
        console.log('Current i18n bundle:', {
          hasBundle: !!bundle,
          bundleKeys: Object.keys(bundle || {}),
          hasDigitalHubBanner: bundle && 'DIGITAL_HUB_BANNER' in bundle,
        });
      } else {
        console.error(
          'Failed to fetch current resources:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error testing current resources:', error);
    }
  };

  const handleTestHindiResources = async () => {
    console.log('Testing Hindi resource loading...');
    try {
      console.log(
        'Fetching from:',
        window.location.origin + '/locales/hi/common.json'
      );
      const response = await fetch('/locales/hi/common.json');
      console.log('Hindi resource fetch response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (response.ok) {
        const resources = await response.json();
        console.log('Hindi resources loaded:', {
          keys: Object.keys(resources),
          hasDigitalHubBanner: 'DIGITAL_HUB_BANNER' in resources,
          digitalHubBannerValue: resources.DIGITAL_HUB_BANNER,
          totalKeys: Object.keys(resources).length,
        });

        // Try to add the resources to i18n
        i18n.addResourceBundle('hi', 'common', resources, true, true);
        console.log('Hindi resources added to i18n');

        // Verify the bundle was added
        const bundle = i18n.getResourceBundle('hi', 'common');
        console.log('Bundle verification:', {
          hasBundle: !!bundle,
          bundleKeys: Object.keys(bundle || {}),
          hasDigitalHubBanner: bundle && 'DIGITAL_HUB_BANNER' in bundle,
        });

        // Force a re-render
        setDebugInfo((prev) => ({
          ...prev,
          updateCount: prev.updateCount + 1,
        }));
      } else {
        console.error(
          'Failed to fetch Hindi resources:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error testing Hindi resources:', error);
    }
  };

  // Only show in development and after mounting
  if (process.env.NODE_ENV !== 'development' || !mounted) {
    return null;
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        maxWidth: 350,
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #ccc',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Language Debug Info
      </Typography>
      <Box sx={{ fontSize: '12px', fontFamily: 'monospace', mb: 2 }}>
        <div>Current Language: {debugInfo.currentLanguage}</div>
        <div>HTML Lang: {debugInfo.htmlLang}</div>
        <div>localStorage: {debugInfo.localStorage}</div>
        <div>i18n Ready: {debugInfo.i18nReady ? 'Yes' : 'No'}</div>
        <div>Has Resources: {debugInfo.hasResources ? 'Yes' : 'No'}</div>
        <div>Update Count: {debugInfo.updateCount}</div>
        <div style={{ marginTop: 8 }}>
          <strong>Test Translation:</strong>
          <div>Hook Translation: {t('DIGITAL_HUB_BANNER')}</div>
          <div>
            Direct i18n: {i18n.t('DIGITAL_HUB_BANNER', { lng: i18n.language })}
          </div>
          <div>
            Bundle Direct:{' '}
            {i18n.getResourceBundle(i18n.language, 'common')?.[
              'DIGITAL_HUB_BANNER'
            ] || 'Not found'}
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <strong>Resource Bundle Info:</strong>
          <div>
            Bundle:{' '}
            {i18n.getResourceBundle(i18n.language, 'common')
              ? 'Loaded'
              : 'Not loaded'}
          </div>
          <div>
            Bundle Keys:{' '}
            {
              Object.keys(i18n.getResourceBundle(i18n.language, 'common') || {})
                .length
            }
          </div>
          <div>
            Direct Translation:{' '}
            {i18n.t('DIGITAL_HUB_BANNER', { lng: i18n.language })}
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <strong>Language Status:</strong>
          <div>Ready: {ready ? 'Yes' : 'No'}</div>
          <div>Mounted: {mounted ? 'Yes' : 'No'}</div>
          <div>Force Update: {forceUpdate}</div>
        </div>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleTestLanguageChange(LANGUAGES.ENGLISH)}
          disabled={!ready}
        >
          Test EN
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleTestLanguageChange(LANGUAGES.HINDI)}
          disabled={!ready}
        >
          Test HI
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleReloadResources}
          disabled={!ready}
          color="secondary"
        >
          Reload
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleForceHindiChange}
          disabled={!ready}
          color="warning"
        >
          Force HI
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleTestHindiResources}
          disabled={!ready}
          color="info"
        >
          Test HI File
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleTestCurrentResources}
          disabled={!ready}
          color="info"
        >
          Test Current Resources
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleRefreshTranslationHook}
          disabled={!ready}
          color="primary"
        >
          Refresh Hook
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleSyncCurrentBundle}
          disabled={!ready}
          color="info"
        >
          Sync Bundle
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        Use header language switcher to test full functionality
      </Typography>
    </Paper>
  );
};

export default LanguageDebugger;
