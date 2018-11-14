'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.defaultErrorHandler = exports.createError = exports.filterProps = exports.escape = exports.intlConfigPropNames = void 0;

var _types = require('./types');

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var intlConfigPropNames = Object.keys(_types.intlConfigPropTypes);
exports.intlConfigPropNames = intlConfigPropNames;
var ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
};
var UNSAFE_CHARS_REGEX = /[&><"']/g;

var escape = function escape(str) {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, function(match) {
    return ESCAPED_CHARS[match];
  });
};

exports.escape = escape;

var filterProps = function filterProps(props, whitelist) {
  var defaults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return whitelist.reduce(function(filtered, name) {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults.hasOwnProperty(name)) {
      filtered[name] = defaults[name];
    }

    return filtered;
  }, {});
};

exports.filterProps = filterProps;

var createError = function createError(message, exception) {
  var eMsg = exception ? '\n'.concat(exception) : '';
  return '[React Intl] '.concat(message).concat(eMsg);
};

exports.createError = createError;

var defaultErrorHandler = function defaultErrorHandler(error) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }
};

exports.defaultErrorHandler = defaultErrorHandler;
