const nativeToString = Object.prototype.toString;

function isType(type: string) {
  return function (value: unknown) {
    return nativeToString.call(value) === `[object ${type}]`;
  };
}

export const variableTypeDetection = {
  isWindow: isType('Window'),
};

export function isError(error: unknown) {
  switch (nativeToString.call(error)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return false;
  }
}
