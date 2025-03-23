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
  ver?: string;
  pid?: string;
}

export interface ContextRollup {
  l2?: string;
  l1?: string;
  l4?: string;
  l3?: string;
}

export interface Cdata {
  id: string;
  type: string;
}

export interface Context {
  authToken?: string;
  mode?: string;
  sid?: string;
  uid?: string;
  did?: any;
  channel: string;
  contextRollup?: ContextRollup;
  pdata: Pdata;
  tags?: string[];
  timeDiff?: number;
  cdata?: Cdata[];
  objectRollup?: ContextRollup;
  endpoint?: string;
  dispatcher?: object;
  host?: string;
  contentId?: any;
  dims?: any[];
  partner?: any[];
  app?: string[];
  userData?: {
    firstName: string;
    lastName: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {
  [propName: string]: any;
  toolBar?: {
    showZoomButtons?: boolean;
    showPagingButtons?: boolean;
    showPagesButton?: boolean;
    showRotateButton?: boolean;
    showSearchButton?: boolean;
  };
  sideMenu?: {
    showShare?: boolean;
    showReplay?: boolean;
    showDownload?: boolean;
    showPrint?: boolean;
    showExit?: boolean;
  };
}

export interface Metadata {
  identifier: string;
  artifactUrl: string;
  name: string;
  streamingUrl?: string;
  pkgVersion?: number;
  compatibilityLevel?: number;
  isAvailableLocally?: boolean;
  baseDir?: string;
  basePath?: string;
}
export interface PlayerConfig {
  metadata?: Metadata;
  data?: any;
  config?: Config;
  context?: Context;
}

export const MIME_TYPE = {
  QUESTION_SET_MIME_TYPE: 'application/vnd.sunbird.questionset',
  INTERACTIVE_MIME_TYPE: [
    'application/vnd.ekstep.h5p-archive',
    'application/vnd.ekstep.html-archive',
    'application/vnd.ekstep.ecml-archive',
  ],
};

export const getTelemetryConfig = (): Context => {
  let localStorageData = {
    userName: '',
    accToken: '',
    tenantId: '',
    tenantCode: '',
    did: '',
    sid: '',
    uid: '',
  };
  if (typeof window !== 'undefined' && window.localStorage) {
    const ls = window.localStorage;
    localStorageData = {
      userName: ls.getItem('userName') ?? '',
      accToken: ls.getItem('accToken') ?? '',
      sid: ls.getItem('accToken') ?? '',
      uid: ls.getItem('userId') ?? '',
      tenantId: ls.getItem('tenantId') ?? '',
      tenantCode: ls.getItem('tenant-code') ?? '',
      did: ls.getItem('did') ?? '',
    };
  }
  return {
    mode: 'play',
    partner: [],
    pdata: {
      id: 'shikshav2.0.learner.portal',
      ver: '1.0.0',
      pid: 'learner-portal',
    },
    contentId: '',
    channel: localStorageData.tenantCode,
    tags: [localStorageData.tenantCode],
    contextRollup: { l1: localStorageData.tenantCode },
    objectRollup: {},
    userData: { firstName: localStorageData.userName, lastName: '' },
    host: '',
    endpoint: '/v1/telemetry',
    ...localStorageData,
  };
};

export const V2PlayerConfig: PlayerConfig = {
  context: getTelemetryConfig(),
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
    host: '',
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
  context: getTelemetryConfig(),
  data: {},
};
