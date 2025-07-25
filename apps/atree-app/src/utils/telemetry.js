import { generateUUID, getDeviceId } from './Helper';
const hostURL = process.env.NEXT_PUBLIC_TELEMETRY_URL;

let CsTelemetryModule;
let EkTelemetry;
let jQuery;

if (typeof window !== 'undefined') {
  CsTelemetryModule =
    require('@project-sunbird/client-services/telemetry').CsTelemetryModule;
  EkTelemetry = require('@project-sunbird/telemetry-sdk');
  jQuery = require('jquery');
  window.jQuery = jQuery;
}

// Load session ID (sid) and user ID from localStorage if available
const sessionId =
  (typeof window !== 'undefined' && localStorage.getItem('sid')) ||
  generateUUID();
if (typeof window !== 'undefined') localStorage.setItem('sid', sessionId);

const telemetryConfig = {
  apislug: '',
  pdata: {
    id: 'atree',
    pid: '0.0.1',
    ver: 'atree',
  },
  env: 'atree',
  channel: '',
  did: 'did',
  authtoken: '',
  userId:
    (typeof window !== 'undefined' && localStorage.getItem('userId')) ||
    'Anonymous',
  uid:
    (typeof window !== 'undefined' && localStorage.getItem('userId')) ||
    'Anonymous',
  sid: sessionId,
  batchsize: 3,
  mode: '',
  host: hostURL,
  endpoint: '/v1/telemetry',
  tags: [],
};

// Wait for device ID before initializing telemetry
if (typeof window !== 'undefined') {
  getDeviceId().then((deviceId) => {
    telemetryConfig.did = deviceId;
    localStorage.setItem('deviceId', deviceId);
    console.log('Telemetry Device ID (did):', deviceId);

    // Ensure telemetry is initialized only once
    if (!CsTelemetryModule.instance.isInitialised) {
      CsTelemetryModule.instance.init({});
      CsTelemetryModule.instance.telemetryService.initTelemetry({
        config: telemetryConfig,
        userOrgDetails: {},
      });
    }
  });
}

// Exportable telemetry factory
export const telemetryFactory = {
  init: () => {
    if (
      typeof window !== 'undefined' &&
      !CsTelemetryModule.instance.isInitialised
    ) {
      CsTelemetryModule.instance.init({});
      CsTelemetryModule.instance.telemetryService.initTelemetry({
        config: telemetryConfig,
        userOrgDetails: {},
      });
    }
  },

  updateUserId: (userId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);
      telemetryConfig.uid = userId;
      telemetryConfig.userId = userId;
      console.log('Telemetry UID updated after login:', userId);
    }
  },

  interact: (interactEventInput) => {
    if (
      typeof window !== 'undefined' &&
      CsTelemetryModule.instance.isInitialised
    ) {
      const eventData = getEventData(interactEventInput);
      CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
        options: eventData.options,
        edata: eventData.edata,
      });
    }
  },

  impression: (impressionEventInput) => {
    if (
      typeof window !== 'undefined' &&
      CsTelemetryModule.instance.isInitialised
    ) {
      const eventData = getEventData(impressionEventInput);
      CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
        options: eventData.options,
        edata: eventData.edata,
      });
    }
  },

  assess: (assessEventInput) => {
    if (
      typeof window !== 'undefined' &&
      CsTelemetryModule.instance.isInitialised
    ) {
      const eventData = getEventData(assessEventInput);
      CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry({
        options: eventData.options,
        edata: eventData.edata,
      });
    }
  },

  response: (responseEventInput) => {
    if (
      typeof window !== 'undefined' &&
      CsTelemetryModule.instance.isInitialised
    ) {
      const eventData = getEventData(responseEventInput);
      CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry({
        options: eventData.options,
        edata: eventData.edata,
      });
    }
  },

  interrupt: (interruptEventInput) => {
    if (
      typeof window !== 'undefined' &&
      CsTelemetryModule.instance.isInitialised
    ) {
      const eventData = getEventData(interruptEventInput);
      CsTelemetryModule.instance.telemetryService.raiseInterruptTelemetry({
        options: eventData.options,
        edata: eventData.edata,
      });
    }
  },

  start: ({ appName, ...edata }) => {
    if (typeof window !== 'undefined') {
      return {
        type: edata?.type,
        eid: generateUUID(),
        $set: { id: localStorage.getItem('userId') || 'Anonymous' },
        actor: {
          id: localStorage.getItem('userId') || 'Anonymous',
          type: 'User',
        },
        context: {
          type: appName || 'Standalone',
        },
        edata,
      };
    }
  },

  end: ({ appName, ...edata }) => {
    if (typeof window !== 'undefined') {
      return {
        type: edata?.type,
        eid: generateUUID(),
        $set: { id: localStorage.getItem('userId') || 'Anonymous' },
        actor: {
          id: localStorage.getItem('userId') || 'Anonymous',
          type: 'User',
        },
        context: {
          type: appName || 'Standalone',
        },
        edata,
      };
    }
  },

  // Optional login audit event for analysis
  loginAudit: () => {
    telemetryFactory.interact({
      edata: {
        id: 'login',
        type: 'system',
        subtype: 'user-login',
        pageid: 'login-page',
        channel: telemetryConfig.channel,
      },
      context: {
        pdata: telemetryConfig.pdata,
        env: telemetryConfig.env,
        cdata: [],
      },
    });
  },
};

function getEventData(eventInput) {
  const timestamp = Date.now();
  return {
    edata: eventInput.edata,
    options: {
      context: getEventContext(eventInput),
      object: getEventObject(eventInput),
      tags: [],
    },
    ets: timestamp,
  };
}

function getEventObject(eventInput) {
  if (eventInput.object) {
    return {
      id: eventInput.object.id || '',
      type: eventInput.object.type || '',
      ver: eventInput.object.ver || '',
      rollup: eventInput.object.rollup || {},
    };
  }
  return {};
}

function getEventContext(eventInput) {
  const eventContextData = {
    channel: eventInput.edata.channel || telemetryConfig.channel,
    pdata: eventInput.context?.pdata || telemetryConfig.pdata,
    env: eventInput.context?.env || telemetryConfig.env,
    sid: telemetryConfig.sid,
    uid: localStorage.getItem('userId') || telemetryConfig.uid,
    cdata: eventInput.context?.cdata || [],
  };

  if (telemetryConfig.sid) {
    eventContextData.cdata.push({
      id: telemetryConfig.sid,
      type: 'UserSession',
    });
  }

  eventContextData.cdata.push({
    id: telemetryConfig.did,
    type: 'Device',
  });

  return eventContextData;
}

function getRollUpData(data = []) {
  const rollUp = {};
  data.forEach((element, index) => {
    rollUp['l' + (index + 1)] = element;
  });
  return rollUp;
}
