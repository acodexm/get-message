/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
import IntlRelativeFormat from 'intl-relativeformat';
import React, { createElement, isValidElement } from 'react';
import invariant from 'invariant';
import {
  dateTimeFormatPropTypes,
  numberFormatPropTypes,
  relativeFormatPropTypes,
  pluralFormatPropTypes
} from './types';

import { createError, defaultErrorHandler, escape, filterProps } from './utils';
import createFormatCache from 'intl-format-cache';
import IntlMessageFormat from 'intl-messageformat';
import IntlPluralFormat from './plural';

const getNumberFormat = createFormatCache(Intl.NumberFormat);
const getDateTimeFormat = createFormatCache(Intl.DateTimeFormat);
const getMessageFormat = createFormatCache(IntlMessageFormat);
const getRelativeFormat = createFormatCache(IntlRelativeFormat);
const getPluralFormat = createFormatCache(IntlPluralFormat);

const DATE_TIME_FORMAT_OPTIONS = Object.keys(dateTimeFormatPropTypes);
const NUMBER_FORMAT_OPTIONS = Object.keys(numberFormatPropTypes);
const RELATIVE_FORMAT_OPTIONS = Object.keys(relativeFormatPropTypes);
const PLURAL_FORMAT_OPTIONS = Object.keys(pluralFormatPropTypes);

const RELATIVE_FORMAT_THRESHOLDS = {
  second: 60, // seconds to minute
  minute: 60, // minutes to hour
  hour: 24, // hours to day
  day: 30, // days to month
  month: 12 // months to year
};

const updateRelativeFormatThresholds = (newThresholds) => {
  const { thresholds } = IntlRelativeFormat;
  ({
    second: thresholds.second,
    minute: thresholds.minute,
    hour: thresholds.hour,
    day: thresholds.day,
    month: thresholds.month,
    'second-short': thresholds['second-short'],
    'minute-short': thresholds['minute-short'],
    'hour-short': thresholds['hour-short'],
    'day-short': thresholds['day-short'],
    'month-short': thresholds['month-short']
  } = newThresholds);
};

const getNamedFormat = (formats, type, name, onError) => {
  let format = formats && formats[type] && formats[type][name];
  if (format) {
    return format;
  }

  onError(createError(`No ${type} format named: ${name}`));
};

export const formatDate = (config) => (value, options = {}) => {
  const { locale, formats, timeZone } = config;
  const { format } = options;

  let onError = config.onError || defaultErrorHandler;
  let date = new Date(value);
  let defaults = {
    ...(timeZone && { timeZone }),
    ...(format && getNamedFormat(formats, 'date', format, onError))
  };
  let filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults);

  try {
    return getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    onError(createError('Error formatting date.', e));
  }

  return String(date);
};

export const formatTime = (config) => (value, options = {}) => {
  const { locale, formats, timeZone } = config;
  const { format } = options;

  let onError = config.onError || defaultErrorHandler;
  let date = new Date(value);
  let defaults = {
    ...(timeZone && { timeZone }),
    ...(format && getNamedFormat(formats, 'time', format, onError))
  };
  let filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults);

  if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
    // Add default formatting options if hour, minute, or second isn't defined.
    filteredOptions = { ...filteredOptions, hour: 'numeric', minute: 'numeric' };
  }

  try {
    return getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    onError(createError('Error formatting time.', e));
  }

  return String(date);
};

export const formatRelative = (config) => (value, options = {}) => {
  const { locale, formats } = config;
  const { format } = options;

  let onError = config.onError || defaultErrorHandler;
  let date = new Date(value);
  let now = new Date(options.now);
  let defaults = format && getNamedFormat(formats, 'relative', format, onError);
  let filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults);

  // Capture the current threshold values, then temporarily override them with
  // specific values just for this render.
  const oldThresholds = { ...IntlRelativeFormat.thresholds };
  updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

  try {
    return getRelativeFormat(locale, filteredOptions).format(date, {
      now: isFinite(now) ? now : Date.now()
    });
  } catch (e) {
    onError(createError('Error formatting relative time.', e));
  } finally {
    updateRelativeFormatThresholds(oldThresholds);
  }

  return String(date);
};

export const formatNumber = (config) => (value, options = {}) => {
  const { locale, formats } = config;
  const { format } = options;

  let onError = config.onError || defaultErrorHandler;
  let defaults = format && getNamedFormat(formats, 'number', format, onError);
  let filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults);

  try {
    return getNumberFormat(locale, filteredOptions).format(value);
  } catch (e) {
    onError(createError('Error formatting number.', e));
  }

  return String(value);
};

export const formatPlural = (config) => (value, options = {}) => {
  const { locale } = config;

  let filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);
  let onError = config.onError || defaultErrorHandler;

  try {
    return getPluralFormat(locale, filteredOptions).format(value);
  } catch (e) {
    onError(createError('Error formatting plural.', e));
  }

  return 'other';
};

export const formatMessage = (config) => (messageDescriptor = {}, values = {}) => {
  const { locale, formats, messages, defaultLocale, defaultFormats } = config;

  const { id, defaultMessage } = messageDescriptor;

  const message = messages && messages[id];
  const hasValues = Object.keys(values).length > 0;

  // `id` is a required field of a Message Descriptor.
  invariant(id, '[React Intl] An `id` must be provided to format a message.');

  // Avoid expensive message formatting for simple messages without values. In
  // development messages will always be formatted in case of missing values.
  if (!hasValues && process.env.NODE_ENV === 'production') {
    return message || defaultMessage || id;
  }

  let formattedMessage;
  let onError = config.onError || defaultErrorHandler;

  if (message) {
    try {
      let formatter = getMessageFormat(message, locale, formats);

      formattedMessage = formatter.format(values);
    } catch (e) {
      onError(
        createError(
          `Error formatting message: "${id}" for locale: "${locale}"` +
            (defaultMessage ? ', using default message as fallback.' : ''),
          e
        )
      );
    }
  } else {
    // This prevents warnings from littering the console in development
    // when no `messages` are passed into the <IntlProvider> for the
    // default locale, and a default message is in the source.
    if (!defaultMessage || (locale && locale.toLowerCase() !== defaultLocale.toLowerCase())) {
      onError(
        createError(
          `Missing message: "${id}" for locale: "${locale}"` +
            (defaultMessage ? ', using default message as fallback.' : '')
        )
      );
    }
  }

  if (!formattedMessage && defaultMessage) {
    try {
      let formatter = getMessageFormat(defaultMessage, defaultLocale, defaultFormats);

      formattedMessage = formatter.format(values);
    } catch (e) {
      onError(createError(`Error formatting the default message for: "${id}"`, e));
    }
  }

  if (!formattedMessage) {
    onError(
      createError(
        `Cannot format message: "${id}", ` + `using message ${message || defaultMessage ? 'source' : 'id'} as fallback.`
      )
    );
  }
  return formattedMessage || message || defaultMessage || id;
};

export const formatHTMLMessage = (config) => (messageDescriptor, rawValues = {}) => {
  // Process all the values before they are used when formatting the ICU
  // Message string. Since the formatted message might be injected via
  // `innerHTML`, all String-based values need to be HTML-escaped.
  let escapedValues = Object.keys(rawValues).reduce((escaped, name) => {
    let value = rawValues[name];
    escaped[name] = typeof value === 'string' ? escape(value) : value;
    return escaped;
  }, {});

  return formatMessage(config)(messageDescriptor, escapedValues);
};

export const formatReact = (config) => (messageDescriptor, values = {}) => {
  const { textComponent: Component = 'span' } = config;
  let tokenDelimiter;
  let tokenizedValues;
  let elements;

  let hasValues = values && Object.keys(values).length > 0;
  if (hasValues) {
    // Creates a token with a random UID that should not be guessable or
    // conflict with other parts of the `message` string.
    let uid = Math.floor(Math.random() * 0x10000000000).toString(16);

    let generateToken = (() => {
      let counter = 0;
      return () => `ELEMENT-${uid}-${(counter += 1)}`;
    })();

    // Splitting with a delimiter to support IE8. When using a regex
    // with a capture group IE8 does not include the capture group in
    // the resulting array.
    tokenDelimiter = `@__${uid}__@`;
    tokenizedValues = {};
    elements = {};

    // Iterates over the `props` to keep track of any React Element
    // values so they can be represented by the `token` as a placeholder
    // when the `message` is formatted. This allows the formatted
    // message to then be broken-up into parts with references to the
    // React Elements inserted back in.
    Object.keys(values).forEach((name) => {
      let value = values[name];

      if (isValidElement(value)) {
        let token = generateToken();
        tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
        elements[token] = value;
      } else {
        tokenizedValues[name] = value;
      }
    });
  }

  let formattedMessage = formatMessage(config)(messageDescriptor, tokenizedValues || values);

  let nodes;

  let hasElements = elements && Object.keys(elements).length > 0;
  if (hasElements) {
    // Split the message into parts so the React Element values captured
    // above can be inserted back into the rendered message. This
    // approach allows messages to render with React Elements while
    // keeping React's virtual diffing working properly.
    nodes = formattedMessage
      .split(tokenDelimiter)
      .filter((part) => !!part)
      .map((part) => elements[part] || part);
  } else {
    nodes = [formattedMessage];
  }

  // Needs to use `createElement()` instead of JSX, otherwise React will
  // warn about a missing `key` prop with rich-text message formatting.
  return createElement(Component, null, ...nodes);
};
