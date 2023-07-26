import { LIBRARY } from '../constant';
import { Options } from '../types';
import { isBrowserEnv } from './helper';

let initialized = false;
export const checkIfContinue = (options: Options) => {
  const { serverUrl, projectId, disable } = options;
  
  if (initialized) {
    console.warn(`${LIBRARY} initialized.`);
    return false;
  }
  initialized = true;

  if (!isBrowserEnv) {
    console.warn(`${LIBRARY} requires use in a browser environment.`);
    return false;
  }
  if (disable) {
    console.warn(`${LIBRARY} be set to disable.`);
    return false;
  }
  if (!serverUrl || !projectId) {
    console.warn(`${LIBRARY} must have "serverUrl" and "projectId".`);
    return false;
  }
  
  return true;
};
