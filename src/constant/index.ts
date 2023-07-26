import packageInfo from '../../package.json';

const { name, version } = packageInfo;

export const LIBRARY_NAME = name;
export const LIBRARY_VERSION = version;
export const LIBRARY = `${LIBRARY_NAME}@${LIBRARY_VERSION}`;

export const EVENTTYPES = {
  XHR: 'xhr',
  FETCH: 'fetch',
  CLICK: 'click',
  ERROR: 'error',
  UNHANDLEDREJECTION: 'unhandledrejection',
  HISTORY: 'history',
  HASHCHANGE: 'hashchange',
  PERFORMANCE: 'performance',
  RESOURCE_LOAD_ERROR: 'resource_load_error',
  CUSTOM: 'custom',
  TIMELINE: 'timeline',
};

export const EVENT_MAP_DISABLEOPTIONS = {
  [EVENTTYPES.XHR]: 'disableXhr',
  [EVENTTYPES.FETCH]: 'disableFetch',
  [EVENTTYPES.CLICK]: 'disableClick',
  [EVENTTYPES.ERROR]: 'disableError',
  [EVENTTYPES.UNHANDLEDREJECTION]: 'disableUnhandledrejection',
  [EVENTTYPES.HISTORY]: 'disableHistory',
  [EVENTTYPES.HASHCHANGE]: 'disableHashchange',
  [EVENTTYPES.PERFORMANCE]: 'disablePerformance',
};

export const TIMELINE_STATUS_CODE = {
  ERROR: 'error',
  OK: 'ok',
};

export const REPORT_DATA_METHOD = 'POST';
