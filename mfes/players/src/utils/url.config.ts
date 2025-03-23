export const URL_CONFIG = {
  PARAMS: {
    CONTENT_GET:
      'transcripts,ageGroup,appIcon,artifactUrl,attributions,attributions,audience,author,badgeAssertions,body,channel,code,concepts,contentCredits,contentType,contributors,copyright,copyrightYear,createdBy,createdOn,creator,creators,description,displayScore,domain,editorState,flagReasons,flaggedBy,flags,framework,identifier,itemSetPreviewUrl,keywords,language,languageCode,lastUpdatedOn,license,mediaType,mimeType,name,originData,osId,owner,pkgVersion,publisher,questions,resourceType,scoreDisplayConfig,status,streamingUrl,template,templateId,totalQuestions,totalScore,versionKey,visibility,year,primaryCategory,additionalCategories,interceptionPoints,interceptionType',
    LICENSE_DETAILS: 'name,description,url',
    HIERARCHY_FEILDS: 'instructions,outcomeDeclaration',
  },
  API: {
    CONTENT_READ: `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}${process.env.NEXT_PUBLIC_SSUNBIRD_READ_URL}`,
    HIERARCHY_API: `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/action/questionset/v2/hierarchy/`,
    QUESTIONSET_READ: `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/action/questionset/v2/read/`,
    COMPOSITE_SEARCH: `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/interface/v1/action/composite/v3/search`,
    CONTENT_HIERARCHY: `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/action/content/v3/hierarchy`,
  },
};

export interface Pdata {
  id: string;
  pid?: string;
  ver?: string;
}

export interface ContextRollup {
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
}

export interface Cdata {
  type: string;
  id: string;
}

export interface ObjectRollup {
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
}

export interface Context {
  mode?: string;
  authToken?: string;
  sid?: string;
  did?: any;
  uid?: string;
  channel: string;
  pdata: Pdata;
  contextRollup?: ContextRollup;
  tags?: string[];
  cdata?: Cdata[];
  timeDiff?: number;
  objectRollup?: ObjectRollup;
  host?: string;
  endpoint?: string;
  dispatcher?: object;
  partner?: any[];
  contentId?: any;
  dims?: any[];
  app?: string[];
  userData?: {
    firstName: string;
    lastName: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {
  toolBar?: {
    showZoomButtons?: boolean;
    showPagesButton?: boolean;
    showPagingButtons?: boolean;
    showSearchButton?: boolean;
    showRotateButton?: boolean;
  };
  sideMenu?: {
    showShare?: boolean;
    showDownload?: boolean;
    showReplay?: boolean;
    showExit?: boolean;
    showPrint?: boolean;
  };
  [propName: string]: any;
}

export interface Metadata {
  identifier: string;
  name: string;
  artifactUrl: string;
  streamingUrl?: string;
  compatibilityLevel?: number;
  pkgVersion?: number;
  isAvailableLocally?: boolean;
  basePath?: string;
  baseDir?: string;
}
export interface PlayerConfig {
  context?: Context;
  config?: Config;
  metadata?: Metadata;
  data?: any;
}

export const MIME_TYPE = {
  QUESTION_SET_MIME_TYPE: 'application/vnd.sunbird.questionset',
  INTERACTIVE_MIME_TYPE: [
    'application/vnd.ekstep.h5p-archive',
    'application/vnd.ekstep.html-archive',
    'application/vnd.ekstep.ecml-archive',
  ],
};

let userName = 'arif';
if (typeof window !== 'undefined' && window.localStorage) {
  userName = localStorage.getItem('userName') ?? '';
}

export const V2PlayerConfig: PlayerConfig = {
  context: {
    mode: 'play',
    partner: [],
    pdata: {
      id: 'shikshav2.0.learner.portal',
      ver: '1.0.0',
      pid: 'learner-portal',
    },
    contentId: '',
    authToken: localStorage.getItem('accToken') ?? undefined,
    sid: localStorage.getItem('accToken') ?? undefined,
    did: localStorage.getItem('did') ?? undefined,
    uid: localStorage.getItem('userId') ?? undefined,
    channel: localStorage.getItem('tenant-code') ?? '',
    timeDiff: -0.089,
    tags: [localStorage.getItem('tenant-code') ?? ''],
    contextRollup: { l1: localStorage.getItem('tenant-code') ?? '' },
    objectRollup: {},
    userData: { firstName: userName, lastName: '' },
    host: '',
    endpoint: '/v1/telemetry',
  },
  config: {
    showEndPage: false,
    endPage: [{ template: 'assessment', contentType: ['SelfAssess'] }],
    showStartPage: true,
    host: '',
    overlay: { showUser: false },
    splash: {
      text: '',
      icon: '',
      bgImage: 'assets/icons/splacebackground_1.png',
      webLink: '',
    },
    apislug: '',
    repos: ['/mfe_content/sunbird-plugins/renderer'],
    plugins: [
      { id: 'org.sunbird.iframeEvent', ver: 1, type: 'plugin' },
      { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
    ],
    sideMenu: {
      showShare: false,
      showDownload: true,
      showExit: true,
      showPrint: false,
      showReplay: true,
    },
  },
  data: {},
};

export const V1PlayerConfig: PlayerConfig = {
  config: {
    whiteListUrl: [],
    showEndPage: true,
    endPage: [
      {
        template: 'assessment',
        contentType: ['SelfAssess'],
      },
    ],
    showStartPage: true,
    endpoint: '/v1/telemetry',
    overlay: {
      enableUserSwitcher: true,
      showOverlay: true,
      showNext: true,
      showPrevious: true,
      showSubmit: false,
      showReload: false,
      showUser: false,
      showExit: true,
      menu: {
        showTeachersInstruction: false,
      },
    },
    splash: {
      text: '',
      icon: '',
      bgImage: 'assets/icons/splacebackground_1.png',
      webLink: '',
    },
    apislug: '',
    repos: ['/mfe_content/sunbird-plugins/renderer'],
    plugins: [
      {
        id: 'org.sunbird.iframeEvent',
        ver: 1,
        type: 'plugin',
      },
      {
        id: 'org.sunbird.player.endpage',
        ver: 1.1,
        type: 'plugin',
      },
    ],
    sideMenu: {
      showShare: true,
      showDownload: true,
      showExit: true,
    },
    enableTelemetryValidation: false,
  },
  context: {
    mode: 'play',
    // partner: [],
    pdata: {
      id: 'shikshav2.0.learner.portal',
      ver: '1.0.0',
      pid: 'learner-portal',
    },
    contentId: '',
    authToken: localStorage.getItem('accToken') ?? undefined,
    sid: localStorage.getItem('accToken') ?? undefined,
    did: localStorage.getItem('did') ?? undefined,
    uid: localStorage.getItem('userId') ?? undefined,
    channel: localStorage.getItem('tenant-code') ?? '',
    tags: [localStorage.getItem('tenant-code') ?? ''],
    app: [localStorage.getItem('tenant-code') ?? ''],
    timeDiff: -1.129,
    contextRollup: {},
    dims: [],
    cdata: [],
    userData: {
      firstName: userName,
      lastName: '',
    },
  },
  data: {},
};
