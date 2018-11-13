'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.pluralFormatPropTypes = exports.relativeFormatPropTypes = exports.numberFormatPropTypes = exports.dateTimeFormatPropTypes = exports.messageDescriptorPropTypes = exports.intlShape = exports.intlFormatPropTypes = exports.intlConfigPropTypes = void 0;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var bool = _propTypes.default.bool,
  number = _propTypes.default.number,
  string = _propTypes.default.string,
  func = _propTypes.default.func,
  object = _propTypes.default.object,
  oneOf = _propTypes.default.oneOf,
  shape = _propTypes.default.shape,
  any = _propTypes.default.any,
  oneOfType = _propTypes.default.oneOfType;
var localeMatcher = oneOf(['best fit', 'lookup']);
var narrowShortLong = oneOf(['narrow', 'short', 'long']);
var numeric2digit = oneOf(['numeric', '2-digit']);
var funcReq = func.isRequired;
var intlConfigPropTypes = {
  locale: string,
  timeZone: string,
  formats: object,
  jsx: bool,
  textComponent: any,
  messages: object,
  defaultLocale: string,
  defaultFormats: object,
  onError: func
};
exports.intlConfigPropTypes = intlConfigPropTypes;
var intlFormatPropTypes = {
  formatDate: funcReq,
  formatTime: funcReq,
  formatRelative: funcReq,
  formatNumber: funcReq,
  formatPlural: funcReq,
  formatMessage: funcReq,
  formatHTMLMessage: funcReq
};
exports.intlFormatPropTypes = intlFormatPropTypes;
var intlShape = shape(
  (0, _objectSpread2.default)({}, intlConfigPropTypes, intlFormatPropTypes, {
    formatters: object,
    now: funcReq
  })
);
exports.intlShape = intlShape;
var messageDescriptorPropTypes = {
  id: string.isRequired,
  description: oneOfType([string, object]),
  defaultMessage: string
};
exports.messageDescriptorPropTypes = messageDescriptorPropTypes;
var dateTimeFormatPropTypes = {
  localeMatcher: localeMatcher,
  formatMatcher: oneOf(['basic', 'best fit']),
  timeZone: string,
  hour12: bool,
  weekday: narrowShortLong,
  era: narrowShortLong,
  year: numeric2digit,
  month: oneOf(['numeric', '2-digit', 'narrow', 'short', 'long']),
  day: numeric2digit,
  hour: numeric2digit,
  minute: numeric2digit,
  second: numeric2digit,
  timeZoneName: oneOf(['short', 'long'])
};
exports.dateTimeFormatPropTypes = dateTimeFormatPropTypes;
var numberFormatPropTypes = {
  localeMatcher: localeMatcher,
  style: oneOf(['decimal', 'currency', 'percent']),
  currency: string,
  currencyDisplay: oneOf(['symbol', 'code', 'name']),
  useGrouping: bool,
  minimumIntegerDigits: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  minimumSignificantDigits: number,
  maximumSignificantDigits: number
};
exports.numberFormatPropTypes = numberFormatPropTypes;
var relativeFormatPropTypes = {
  style: oneOf(['best fit', 'numeric']),
  units: oneOf([
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year',
    'second-short',
    'minute-short',
    'hour-short',
    'day-short',
    'month-short',
    'year-short'
  ])
};
exports.relativeFormatPropTypes = relativeFormatPropTypes;
var pluralFormatPropTypes = {
  style: oneOf(['cardinal', 'ordinal'])
};
exports.pluralFormatPropTypes = pluralFormatPropTypes;
