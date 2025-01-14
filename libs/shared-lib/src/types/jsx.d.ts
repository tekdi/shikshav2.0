declare namespace JSX {
  interface IntrinsicElements {
    'sunbird-epub-player': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'player-config'?: string;
      ref?: React.RefObject<any>;
    };
    'sunbird-pdf-player': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'player-config'?: string;
      ref?: React.RefObject<any>;
    };
    'sunbird-quml-player': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'player-config'?: string;
      ref?: React.RefObject<any>;
    };
    'sunbird-video-player': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'player-config'?: string;
      ref?: React.RefObject<any>;
    };
  }
}
