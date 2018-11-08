const ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
};

const UNSAFE_CHARS_REGEX = /[&><"']/g;

export const extend = (obj, ...rest) => {
  Array.prototype.slice.call(rest, 1).forEach((source) => {
    Object.keys(source).forEach((key) => {
      obj[key] = source[key];
    });
  });
  return obj;
};
export const escape = (str) => {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, (match) => ESCAPED_CHARS[match]);
};

export const assertIsDate = (date, errMsg) => {
  // Determine if the `date` is valid by checking if it is finite, which
  // is the same way that `Intl.DateTimeFormat#format()` checks.
  if (!isFinite(date)) {
    throw new TypeError(errMsg);
  }
};

export const assertIsNumber = (num, errMsg) => {
  if (typeof num !== 'number') {
    throw new TypeError(errMsg);
  }
};
