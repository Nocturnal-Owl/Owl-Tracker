import { variableTypeDetection } from './is';

export const generateUuid = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export const getYMDHMS = () => {
  const datetime = new Date();
  const year = datetime.getFullYear();
  const month = (`0${datetime.getMonth() + 1}`).slice(-2);
  const date = (`0${datetime.getDate()}`).slice(-2);
  return `${year}-${month}-${date}`;
};

export const getPageUrl = () => window.document.location.href;

export const getTimestamp = () => Date.now();

export const debounce = (fn: (...params: unknown[]) => void, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const formatActiveElement = (target: HTMLElement) => {
  const {
    tagName, classList: { value }, id, innerText,
  } = target;
  const tagNameValue = tagName.toLowerCase();
  if (['html', 'body'].includes(tagNameValue)) {
    return '';
  }

  const idValue = id ? ` id="${id}"` : '';
  const classValue = value ? ` class=“${value}“` : '';
  return `<${tagNameValue}${idValue}${classValue}>${innerText}</${tagNameValue}>`;
};

export const isBrowserEnv = variableTypeDetection.isWindow(window);
