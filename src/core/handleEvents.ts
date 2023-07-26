import ErrorStackParser from 'error-stack-parser';
import {
  onLCP, onFID, onCLS, onFCP, onTTFB, Metric,
} from 'web-vitals';
import { EVENTTYPES, TIMELINE_STATUS_CODE } from '../constant';
import {
  ClickInfo, ErrorOrUnhandledrejectionInfo, HistoryOrHashChangeInfo, PerformanceInfo, ResourceLoadErrorInfo, XhrOrFetchInfo,
} from '../types';
import {
  fetchReplace, historyReplace, listentClick, listentError, listentOnhashchange, listentUnhandledrejection, xhrReplace,
} from './rewrite';
import { formatActiveElement, getTimestamp, globalStore } from '../utils';

const handleHttp = (xhrOrFetchInfo: XhrOrFetchInfo, type: string) => {
  const { timeline, reportData } = globalStore;
  const { status, time } = xhrOrFetchInfo;
  const isError = status === 0 || status > 400;

  timeline.push({
    type,
    status: isError ? TIMELINE_STATUS_CODE.ERROR : TIMELINE_STATUS_CODE.OK,
    time,
    data: xhrOrFetchInfo,
  });

  if (isError) {
    reportData.send(xhrOrFetchInfo);
  }
};

export const handleEvents = {
  [EVENTTYPES.XHR]: () => {
    xhrReplace((xhrInfo: XhrOrFetchInfo) => {
      handleHttp(xhrInfo, EVENTTYPES.XHR);
    });
  },
  [EVENTTYPES.FETCH]: () => {
    fetchReplace((fetchInfo: XhrOrFetchInfo) => {
      handleHttp(fetchInfo, EVENTTYPES.FETCH);
    });
  },
  [EVENTTYPES.CLICK]: () => {
    listentClick((target: HTMLElement) => {
      const { timeline } = globalStore;
      const activeElement = formatActiveElement(target);
      const clickInfo: ClickInfo = {
        type: EVENTTYPES.CLICK,
        time: getTimestamp(),
        activeElement,
      };
      if (activeElement) {
        timeline.push({
          type: EVENTTYPES.CLICK,
          status: TIMELINE_STATUS_CODE.OK,
          data: clickInfo,
          time: getTimestamp(),
        });
      }
    });
  },
  [EVENTTYPES.ERROR]: () => {
    listentError((e: ErrorEvent) => {
      try {
        const { timeline, reportData } = globalStore;
        const { target, error } = e;
        const newTarget = target as HTMLElement;

        if (newTarget.localName) {
          const resourceLoadErrorInfo: ResourceLoadErrorInfo = {
            type: EVENTTYPES.RESOURCE_LOAD_ERROR,
            time: getTimestamp(),
            tagName: newTarget.localName,
            resourceUrl: (newTarget as (HTMLScriptElement | HTMLImageElement)).src || (newTarget as HTMLLinkElement).href,
          };
          timeline.push({
            type: EVENTTYPES.RESOURCE_LOAD_ERROR,
            status: TIMELINE_STATUS_CODE.ERROR,
            time: getTimestamp(),
            data: resourceLoadErrorInfo,
          });
          reportData.send(resourceLoadErrorInfo);
        } else {
          const stackFrame = ErrorStackParser.parse(!target ? e : error)[0];
          const { fileName, columnNumber, lineNumber } = stackFrame;
          const errorInfo: ErrorOrUnhandledrejectionInfo = {
            type: EVENTTYPES.ERROR,
            time: getTimestamp(),
            message: e.message,
            fileName,
            lineNumber,
            columnNumber,
          };
          timeline.push({
            type: EVENTTYPES.ERROR,
            status: TIMELINE_STATUS_CODE.ERROR,
            time: getTimestamp(),
            data: errorInfo,
          });
          reportData.send(errorInfo);
        }
      } catch (error) {
        console.log(error);
      }
    });
  },
  [EVENTTYPES.UNHANDLEDREJECTION]: () => {
    listentUnhandledrejection((e: PromiseRejectionEvent) => {
      try {
        const { timeline, reportData } = globalStore;
        const stackFrame = ErrorStackParser.parse(e.reason)[0];
        const { fileName, columnNumber, lineNumber } = stackFrame;
        const unhandledrejectionInfo: ErrorOrUnhandledrejectionInfo = {
          type: EVENTTYPES.UNHANDLEDREJECTION,
          time: getTimestamp(),
          fileName,
          lineNumber,
          columnNumber,
          message: JSON.stringify(e.reason.message || e.reason.stack),
        };
        timeline.push({
          type: EVENTTYPES.UNHANDLEDREJECTION,
          data: unhandledrejectionInfo,
          time: getTimestamp(),
          status: TIMELINE_STATUS_CODE.ERROR,
        });
        reportData.send(unhandledrejectionInfo);
      } catch (error) {
        console.log(error);
      }
    });
  },
  [EVENTTYPES.HISTORY]: () => {
    historyReplace(({ from, to }: { from: string, to: string }) => {
      const { timeline } = globalStore;
      const historyInfo: HistoryOrHashChangeInfo = {
        type: EVENTTYPES.HISTORY,
        time: getTimestamp(),
        from,
        to,
      };
      timeline.push({
        type: EVENTTYPES.HISTORY,
        status: TIMELINE_STATUS_CODE.OK,
        time: getTimestamp(),
        data: historyInfo,
      });
    });
  },
  [EVENTTYPES.HASHCHANGE]: () => {
    listentOnhashchange((e: HashChangeEvent) => {
      const { timeline } = globalStore;
      const { oldURL: from, newURL: to } = e;
      const hashChangeInfo: HistoryOrHashChangeInfo = {
        type: EVENTTYPES.HASHCHANGE,
        time: getTimestamp(),
        from,
        to,
      };
      timeline.push({
        type: EVENTTYPES.HASHCHANGE,
        status: TIMELINE_STATUS_CODE.OK,
        time: getTimestamp(),
        data: hashChangeInfo,
      });
    });
  },
  [EVENTTYPES.PERFORMANCE]: () => {
    function getWebVitals(metric: Metric) {
      const { reportData } = globalStore;
      const { name, rating, value } = metric;
      const performanceInfo: PerformanceInfo = {
        type: EVENTTYPES.PERFORMANCE,
        time: getTimestamp(),
        name,
        rating,
        value,
      };
      reportData.send(performanceInfo);
    }
    onLCP(getWebVitals);
    onFID(getWebVitals);
    onCLS(getWebVitals);
    onFCP(getWebVitals);
    onTTFB(getWebVitals);
  },
};
