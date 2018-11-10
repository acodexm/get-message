'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

var _intlMessageformat = _interopRequireDefault(require('intl-messageformat'));

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
// This is a "hack" until a proper `intl-pluralformat` package is created.
function resolveLocale(locales) {
  // IntlMessageFormat#_resolveLocale() does not depend on `this`.
  return _intlMessageformat.default.prototype._resolveLocale(locales);
}

function findPluralFunction(locale) {
  // IntlMessageFormat#_findPluralFunction() does not depend on `this`.
  return _intlMessageformat.default.prototype._findPluralRuleFunction(locale);
}

var IntlPluralFormat = function IntlPluralFormat(locales) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _classCallCheck2.default)(this, IntlPluralFormat);
  var useOrdinal = options.style === 'ordinal';
  var pluralFn = findPluralFunction(resolveLocale(locales));

  this.format = function(value) {
    return pluralFn(value, useOrdinal);
  };
};

exports.default = IntlPluralFormat;
