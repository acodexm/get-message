import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';
import createFormatCache from 'intl-format-cache';
import { extend, escape, assertIsDate, assertIsNumber } from './utils';

const getNumberFormat = createFormatCache(Intl.NumberFormat);
const getDateTimeFormat = createFormatCache(Intl.DateTimeFormat);
const getMessageFormat = createFormatCache(IntlMessageFormat);
const getRelativeFormat = createFormatCache(IntlRelativeFormat);

const getFormatOptions = (type, format, options) => {
  const { hash } = options;
  let formatOptions;

  if (format) {
    if (typeof format === 'string') {
      formatOptions = intlGet(`formats.${type}.${format}`, options);
    }

    formatOptions = extend({}, formatOptions, hash);
  } else {
    formatOptions = hash;
  }

  return formatOptions;
};

const intl = (options) => {
  if (!options.fn) {
    throw new Error('{intl} must be invoked as a block helper');
  }

  // Create a new intl data object and extend it with `options.data.intl` and `options.hash`.
  const { data } = options;
  data.intl = extend({}, data.intl, options.hash);

  return options.fn(this, { data });
};

const intlGet = (path, options) => {
  let intlData = options.data && options.data.intl;

  const pathParts = path.split('.');

  let obj;
  // Use the path to walk the Intl data to find the object at the given
  // path, and throw a descriptive error if it's not found.
  try {
    pathParts.forEach((part) => {
      obj = intlData = intlData[part];
    });
  } finally {
    if (!obj) {
      throw new ReferenceError(`Could not find Intl object: ${path}`);
    }
  }

  return obj;
};

const formatDate = (date, format, options) => {
  date = new Date(date);
  assertIsDate(date, 'A date or timestamp must be provided to {date}');
  if (!options) {
    options = format;
    format = null;
  }
  const locales = options.data.intl && options.data.intl.locales;
  const formatOptions = getFormatOptions('date', format, options);

  return getDateTimeFormat(locales, formatOptions).format(date);
};

const formatTime = (date, format, options) => {
  date = new Date(date);
  assertIsDate(date, 'A date or timestamp must be provided to {time}');
  if (!options) {
    options = format;
    format = null;
  }
  const locales = options.data.intl && options.data.intl.locales;
  const formatOptions = getFormatOptions('time', format, options);

  return getDateTimeFormat(locales, formatOptions).format(date);
};

const formatRelative = (date, format, options) => {
  date = new Date(date);
  assertIsDate(date, 'A date or timestamp must be provided to {relative}');
  if (!options) {
    options = format;
    format = null;
  }
  const locales = options.data.intl && options.data.intl.locales;
  const formatOptions = getFormatOptions('relative', format, options);

  return getRelativeFormat(locales, formatOptions).format(date);
};

const formatNumber = (num, format, options) => {
  assertIsNumber(num, 'A number must be provided to {number}');
  if (!options) {
    options = format;
    format = null;
  }
  const locales = options.data.intl && options.data.intl.locales;
  const formatOptions = getFormatOptions('number', format, options);

  return getNumberFormat(locales, formatOptions).format(num);
};

const formatMessage = (message, options) => {
  if (!(message || typeof message === 'string')) {
    throw new ReferenceError('{message} must be provided a message or intlName');
  }

  const intlData = options.data.intl || {};

  const { locales, formats } = intlData;

  if (typeof message === 'string') {
    return getMessageFormat(message, locales, formats);
  }
};

const formatHTMLMessage = (message, options) => {
  // Replace string properties in options with HTML-escaped
  // strings.
  Object.keys(options).forEach((key) => {
    const value = options[key];
    if (typeof value === 'string') {
      options[key] = escape(value);
    }
  });

  return String(formatMessage.apply(message, options));
};

export default {
  intl,
  intlGet,
  formatDate,
  formatTime,
  formatNumber,
  formatMessage,
  formatRelative,
  formatHTMLMessage
};
