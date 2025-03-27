import 'reflect-metadata';
import React, { useEffect, useRef } from 'react';
import {
  handlePlayerEvent,
  handleTelemetryEventPDF,
} from '../../services/TelemetryService';

interface PlayerConfigProps {
  playerConfig: any;
}

const loadScript = (src: string, onLoad: () => void) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = onLoad;
  document.body.appendChild(script);
  return script;
};

const loadStylesheet = (id: string, href: string) => {
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
};

const removeElementById = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.parentNode?.removeChild(element);
  }
};

const SunbirdPdfPlayer = ({ playerConfig }: PlayerConfigProps) => {
  const sunbirdPdfPlayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let jqueryScript: HTMLScriptElement | null = null;
    let pdfPlayerScript: HTMLScriptElement | null = null;

    // Load the Sunbird PDF Player script from CDN
    // It also loads jQuery which is required by the PDF player
    jqueryScript = loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
      () => {
        pdfPlayerScript = loadScript(
          'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-pdf-player-web-component@1.4.0/sunbird-pdf-player.js',
          () => {
            const playerElement = sunbirdPdfPlayerRef.current;
            playerElement?.addEventListener('playerEvent', handlePlayerEvent);
            playerElement?.addEventListener(
              'telemetryEvent',
              handleTelemetryEventPDF
            );
          }
        );

        // Load the PDF player CSS
        loadStylesheet(
          'sunbird-pdf-player-css',
          'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-pdf-player-web-component@1.4.0/styles.css'
        );
      }
    );

    return () => {
      const playerElement = sunbirdPdfPlayerRef.current;
      // Clean up event listeners
      playerElement?.removeEventListener('playerEvent', handlePlayerEvent);
      playerElement?.removeEventListener(
        'telemetryEvent',
        handleTelemetryEventPDF
      );
      // Remove the PDF player script and CSS
      if (jqueryScript?.parentNode) {
        document.body.removeChild(jqueryScript);
      }
      if (pdfPlayerScript?.parentNode) {
        document.body.removeChild(pdfPlayerScript);
      }
      removeElementById('sunbird-pdf-player-css');
    };
  }, []);

  return (
    <div className="player-grid" style={{ height: '100%' }}>
      {/* @ts-ignore */}
      <sunbird-pdf-player
        player-config={JSON.stringify(playerConfig)}
        ref={sunbirdPdfPlayerRef}
      >
        {/* @ts-ignore */}
      </sunbird-pdf-player>
    </div>
  );
};

export default SunbirdPdfPlayer;
