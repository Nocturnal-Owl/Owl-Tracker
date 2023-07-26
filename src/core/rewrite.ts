import { EVENTTYPES, LIBRARY } from '../constant';
import {
  getTimestamp, isIgnoreUrl, debounce, getPageUrl,
} from '../utils';
import { XhrOrFetchInfo } from '../types';

export const xhrReplace = (callback: (xhrInfo: XhrOrFetchInfo) => void) => {
  if (!('XMLHttpRequest' in window)) {
    return;
  }
  const xhrInfoKey = `${LIBRARY}_xhrInfo`;

  const originalXhrProtoOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async?: boolean, username?: string, password?: string) {
    const xhrInfo: XhrOrFetchInfo = {
      type: EVENTTYPES.XHR,
      time: getTimestamp(),
      method: method.toUpperCase(),
      url: url instanceof URL ? url.toString() : url,
      elapsedTime: 0,
      requsetBody: '',
      status: 0,
    };
    this[xhrInfoKey] = xhrInfo;
    originalXhrProtoOpen.call(this, method, url, async, username, password);
  };

  const originalXhrProtoSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit) {
    const xhrInfo = this[xhrInfoKey] as XhrOrFetchInfo;
    const { method, url, time } = xhrInfo;
    this.addEventListener('loadend', () => {
      if (isIgnoreUrl(method, url)) return;
      const { status } = this;
      xhrInfo.elapsedTime = getTimestamp() - time;
      xhrInfo.requsetBody = body ? body.toString() : '';
      xhrInfo.status = status;
      callback(xhrInfo);
    }, false);
    originalXhrProtoSend.call(this, body);
  };
};

export const fetchReplace = (callback: (fetchInfo: XhrOrFetchInfo) => void) => {
  if (!('fetch' in window)) {
    return;
  }
  const originalFetch = window.fetch;
  window.fetch = function (input: URL | RequestInfo, init?: RequestInit) {
    let method = 'GET';
    if (input instanceof Request) {
      method = input.method;
    } else if (init?.method) {
      method = init.method;
    }

    let url = '';
    if (input instanceof URL) {
      url = input.toString();
    } else if (typeof input === 'string') {
      url = input;
    } else {
      url = input.url;
    }

    const time = getTimestamp();

    const fetchInfo: XhrOrFetchInfo = {
      type: EVENTTYPES.FETCH,
      time,
      method: method.toUpperCase(),
      url,
      elapsedTime: 0,
      requsetBody: init ? init.body.toString() : '',
      status: 0,
    };
    const fetchCall = originalFetch.call(this, input, init) as Promise<Response>;
    return fetchCall.then(
      (res) => {
        if (isIgnoreUrl(method, url)) return res;
        const { status } = res;
        fetchInfo.elapsedTime = getTimestamp() - time;
        fetchInfo.status = status;
        callback(fetchInfo);
        return res;
      },
      (err) => {
        if (isIgnoreUrl(method, url)) return undefined;
        const status = 0;
        fetchInfo.elapsedTime = getTimestamp() - time;
        fetchInfo.status = status;
        callback(fetchInfo);
        throw err;
      },
    );
  };
};

export const listentClick = (callback: (target: HTMLElement) => void) => {
  if (!('document' in window)) return;
  const debounceCallback = debounce(callback, 0);
  window.document.addEventListener('click', (e) => {
    debounceCallback(e.target as HTMLElement);
  }, true);
};

export const listentError = (callback: (e: ErrorEvent) => void) => {
  window.addEventListener('error', callback, true);
};

export const listentUnhandledrejection = (callback: (e: PromiseRejectionEvent) => void) => {
  window.addEventListener('unhandledrejection', callback, true);
};

let lastPageUrl = getPageUrl();
export const historyReplace = (callback: ({ from, to }: { from: string, to: string }) => void) => {
  if (!('onpopstate' in window)) return;
  const originalOnpopstate = window.onpopstate;
  window.onpopstate = function (...args) {
    const from = lastPageUrl;
    const to = getPageUrl();
    lastPageUrl = to;
    callback({ from, to });

    if (originalOnpopstate) {
      originalOnpopstate.apply(this, args);
    }
  };

  if (!('history' in window)) return;
  const originalHistoryPushState = window.history.pushState;
  window.history.pushState = function (...args) {
    const from = lastPageUrl;
    const to = getPageUrl();
    lastPageUrl = to;
    callback({ from, to });

    originalHistoryPushState.apply(this, args);
  };

  const originalHistoryReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const from = lastPageUrl;
    const to = getPageUrl();
    lastPageUrl = to;
    callback({ from, to });

    originalHistoryReplaceState.apply(this, args);
  };
};

export const listentOnhashchange = (callback: (e: HashChangeEvent) => void) => {
  window.addEventListener('onhashchange', callback, false);
};
