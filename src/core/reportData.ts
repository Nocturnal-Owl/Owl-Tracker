import { EVENTTYPES, REPORT_DATA_METHOD } from '../constant';
import {
  ReportDataInfo, ALLReportDataType, TimelineInfo, PerformanceInfo,
} from '../types';
import {
  generateUuid, getCommonReportData, getTimestamp, globalStore,
} from '../utils';
import { Queue } from './queue';

export class ReportData {
  queue: Queue;

  constructor() {
    this.queue = new Queue();
  }

  xhrPost(data: ReportDataInfo) {
    const requestFun = async () => {
      const { serverUrl, reportTimeout } = globalStore.options;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), reportTimeout);
      await fetch(`${serverUrl}`, {
        method: REPORT_DATA_METHOD,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(id);
    };

    this.queue.addFn(requestFun);
  }

  send(data: ALLReportDataType) {
    const commonReportData = getCommonReportData();

    if (data.type === EVENTTYPES.PERFORMANCE) {
      const newData = data as PerformanceInfo;
      const reportData = { ...commonReportData, data: newData };
      this.xhrPost(reportData);
      return;
    }

    const timelineId = generateUuid();
    const reportData = { ...commonReportData, data: { ...data, timelineId } };
    this.xhrPost(reportData);

    const { timeline } = globalStore;
    const timelineInfo: TimelineInfo = {
      type: EVENTTYPES.TIMELINE,
      time: getTimestamp(),
      timelineId,
      timelineStack: timeline.getStack(),
    };
    const reportTimelineData = { ...commonReportData, data: timelineInfo };
    this.xhrPost(reportTimelineData);
  }
}
