import { UAParser } from 'ua-parser-js';
import { generateUuid, getPageUrl, getYMDHMS } from './helper';
import { LIBRARY_NAME, LIBRARY_VERSION, LIBRARY, REPORT_DATA_METHOD } from '../constant';
import { Timeline, ReportData } from '../core';
import { GlobalStore, Options } from '../types';

const getGlobalStore = () => {
  const initialGlobalStore: GlobalStore = {
    options: {
      serverUrl: '',
      projectId: '',
      maxTimelineNumber: 20,
      reportTimeout: 10000,
      disable: false,
      userId: '',
      ignoreUrlRegExps: [],
      disableOptions: {
        disableXhr: false,
        disableFetch: false,
        disableClick: false,
        disableError: false,
        disableUnhandledrejection: false,
        disableHistory: false,
        disableHashchange: false,
        disablePerformance: false,
      },
    },
    reportData: new ReportData(),
    timeline: new Timeline(),
    userAgent: JSON.stringify((new UAParser().getResult())),
    websiteLoadId: generateUuid(),
  };
  const globalStoreKey = `__${LIBRARY}__`;
  (window as any)[globalStoreKey] = (window as any)[globalStoreKey] || initialGlobalStore;
  return (window as any)[globalStoreKey] as GlobalStore;
};

export const globalStore = getGlobalStore();

export const setOptions = (options: Options) => {
  globalStore.options = { ...globalStore.options, ...options };
};

export const getCommonReportData = () => {
  const {
    userAgent, websiteLoadId, options: { userId, projectId },
  } = globalStore;
  return {
    libraryName: LIBRARY_NAME,
    libraryVersion: LIBRARY_VERSION,
    userAgent,
    websiteLoadId,
    date: getYMDHMS(),
    pageUrl: getPageUrl(),
    userId,
    projectId,
  };
};

export const isIgnoreUrl = (method: string, url: string): boolean => {
  const { options: { serverUrl, ignoreUrlRegExps } } = globalStore;
  return (method.toUpperCase() === REPORT_DATA_METHOD && serverUrl.includes(url)) || (ignoreUrlRegExps.some((reg) => reg.test(url)));
};
