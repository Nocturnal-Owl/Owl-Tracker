import ErrorStackParser from 'error-stack-parser';
import { EVENTTYPES, TIMELINE_STATUS_CODE } from '../constant';
import { CustomInfo } from '../types';
import { getTimestamp, globalStore, isError } from '../utils';

export const customReportData = (message: string, type?: string, e?: ErrorEvent) => {
  try {
    const { timeline, reportData } = globalStore;

    const customInfo: CustomInfo = {
      type: type || EVENTTYPES.CUSTOM,
      time: getTimestamp(),
      message,
    };

    const hasError = isError(e);

    if (hasError) {
      const { target, error } = e;
      const stackFrame = ErrorStackParser.parse(!target ? e : error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      customInfo.fileName = fileName;
      customInfo.columnNumber = columnNumber;
      customInfo.lineNumber = lineNumber;
    }

    timeline.push({
      type,
      time: getTimestamp(),
      status: hasError ? TIMELINE_STATUS_CODE.ERROR : TIMELINE_STATUS_CODE.OK,
      data: customInfo,
    });

    reportData.send(customInfo);
  } catch (error) {
    console.log(error);
  }
};
