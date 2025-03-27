import 'reflect-metadata';
import React, { useEffect, useRef } from 'react';
import {
  handlePlayerEvent,
  handleTelemetryEventQuml,
} from '../../services/TelemetryService';
import {
  loadScript,
  loadStylesheet,
  removeElementById,
} from './SunbirdPdfPlayer';

interface PlayerConfigProps {
  playerConfig: any;
}

const SunbirdQuMLPlayer = ({ playerConfig }: PlayerConfigProps) => {
  const SunbirdQuMLPlayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let jqueryScript: HTMLScriptElement | null = null;
    let qumlPlayerScript: HTMLScriptElement | null = null;

    // Load the Sunbird Quml Player script from CDN
    // It also loads jQuery which is required by the Quml player
    jqueryScript = loadScript(
      'https://code.jquery.com/jquery-3.6.0.min.js',
      () => {
        if (typeof window !== 'undefined') {
          //@ts-ignore
          window.$ = window.jQuery = $;
          //@ts-ignore
          window.questionListUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/question/v2/list`;
        }
        qumlPlayerScript = loadScript(
          'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-quml-player-web-component@3.0.0/sunbird-quml-player.js',
          () => {
            const playerElement = SunbirdQuMLPlayerRef.current;
            playerElement?.addEventListener('playerEvent', handlePlayerEvent);
            playerElement?.addEventListener(
              'telemetryEvent',
              handleTelemetryEventQuml
            );
          }
        );

        // Load the Quml player CSS
        loadStylesheet(
          'sunbird-quml-player-css',
          'https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-quml-player-web-component@3.0.0/styles.css'
        );
      }
    );

    return () => {
      const playerElement = SunbirdQuMLPlayerRef.current;
      // Clean up event listeners
      playerElement?.removeEventListener('playerEvent', handlePlayerEvent);
      playerElement?.removeEventListener(
        'telemetryEvent',
        handleTelemetryEventQuml
      );
      // Remove the Quml player script and CSS
      if (jqueryScript?.parentNode) {
        document.body.removeChild(jqueryScript);
      }
      if (qumlPlayerScript?.parentNode) {
        document.body.removeChild(qumlPlayerScript);
      }
      removeElementById('sunbird-quml-player-css');
    };
  }, []);

  return (
    <div className="player-grid" style={{ height: '100%' }}>
      {/* @ts-ignore */}
      <sunbird-quml-player
        player-config={JSON.stringify(playerConfig)}
        ref={SunbirdQuMLPlayerRef}
      >
        {/* @ts-ignore */}
      </sunbird-quml-player>
    </div>
  );
};

export default SunbirdQuMLPlayer;
