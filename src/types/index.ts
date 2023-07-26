import { Metric } from 'web-vitals';
import { Timeline, ReportData } from '../core';

export type DisableOptions = {
  disableXhr?: boolean,
  disableFetch?: boolean,
  disableClick?: boolean,
  disableError?: boolean,
  disableUnhandledrejection?: boolean,
  disableHistory?: boolean,
  disableHashchange?: boolean,
  disablePerformance?: boolean,
};

export type Options = {
  serverUrl: string,
  projectId: string,
  maxTimelineNumber?: number,
  reportTimeout?: number,
  disable?: boolean,
  userId?: string,
  ignoreUrlRegExps?: RegExp[],
  disableOptions?: DisableOptions,
};

export type GlobalStore = {
  options: Options;
  reportData: ReportData;
  timeline: Timeline;
  userAgent: string;
  websiteLoadId: string;
};

type BaseInfo = {
  type: string,
  time: number,
};

export type XhrOrFetchInfo = BaseInfo & {
  method: string,
  url: string,
  elapsedTime: number,
  requsetBody: string,
  status: number,
};

export type ClickInfo = BaseInfo & {
  activeElement: string,
};

export type ResourceLoadErrorInfo = BaseInfo & {
  tagName: string,
  resourceUrl: string,
};

export type ErrorOrUnhandledrejectionInfo = BaseInfo & {
  fileName: string,
  lineNumber: number,
  columnNumber: number,
  message: string,
};

export type HistoryOrHashChangeInfo = BaseInfo & {
  from: string,
  to: string,
};

export type PerformanceInfo = BaseInfo & {
  name: Metric['name'],
  rating: Metric['rating'],
  value: Metric['value'],
};

export type CustomInfo = BaseInfo & {
  fileName?: string,
  lineNumber?: number,
  columnNumber?: number,
  message: string,
};

export type TimelineStack = {
  type: string,
  time: number,
  status: string,
  data: XhrOrFetchInfo | ClickInfo | ResourceLoadErrorInfo | ErrorOrUnhandledrejectionInfo | HistoryOrHashChangeInfo | CustomInfo,
};

export type TimelineInfo = BaseInfo & {
  timelineId: string,
  timelineStack: TimelineStack[],
};

export type ReportDataTypeWithTimelineId = TimelineInfo | XhrOrFetchInfo | ResourceLoadErrorInfo | ErrorOrUnhandledrejectionInfo | CustomInfo;

export type ReportDataTypeWithoutTimelineId = PerformanceInfo;

export type ALLReportDataType = ReportDataTypeWithTimelineId | ReportDataTypeWithoutTimelineId;

export type ReportDataInfo = {
  libraryName: string,
  libraryVersion: string,
  userAgent: string,
  websiteLoadId: string,
  date: string,
  pageUrl: string,
  userId: string,
  projectId: string,
  data: (ReportDataTypeWithTimelineId & { timelineId: string }) | ReportDataTypeWithoutTimelineId
};
