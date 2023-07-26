import { LIBRARY_VERSION, LIBRARY_NAME } from './constant';
import { checkIfContinue, setOptions } from './utils';
import { Options } from './types';
import { customReportData, startMonitor } from './core';

function init(options: Options) {
  if (!checkIfContinue(options)) {
    return;
  }

  setOptions(options);
  startMonitor();
}

export {
  LIBRARY_NAME,
  LIBRARY_VERSION,
  init,
  customReportData,
};
