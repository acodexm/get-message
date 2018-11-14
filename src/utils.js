/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import { intlConfigPropTypes } from './types';

export const intlConfigPropNames = Object.keys(intlConfigPropTypes);

const ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
};

const UNSAFE_CHARS_REGEX = /[&><"']/g;

export const escape = (str) => {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, (match) => ESCAPED_CHARS[match]);
};

export const filterProps = (props, whitelist, defaults = {}) => {
  return whitelist.reduce((filtered, name) => {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults.hasOwnProperty(name)) {
      filtered[name] = defaults[name];
    }

    return filtered;
  }, {});
};

export const createError = (message, exception) => {
  const eMsg = exception ? `\n${exception}` : '';
  return `[React Intl] ${message}${eMsg}`;
};

export const defaultErrorHandler = (error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }
};
