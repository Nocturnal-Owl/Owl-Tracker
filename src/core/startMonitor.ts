import { EVENT_MAP_DISABLEOPTIONS } from '../constant';
import { DisableOptions } from '../types';
import { globalStore } from '../utils';
import { handleEvents } from './handleEvents';

export const startMonitor = () => {
  const { options: { disableOptions } } = globalStore;
  Object.keys(handleEvents).forEach((eventType) => {
    const disableOptionName = EVENT_MAP_DISABLEOPTIONS[eventType] as keyof DisableOptions;
    if (!disableOptions[disableOptionName]) {
      handleEvents[eventType]();
    }
  });
};
