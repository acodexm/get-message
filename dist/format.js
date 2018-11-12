'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.formatHTMLMessage = exports.formatMessage = exports.formatPlural = exports.formatNumber = exports.formatRelative = exports.formatTime = exports.formatDate = void 0;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _intlRelativeformat = _interopRequireDefault(require('intl-relativeformat'));

var _invariant = _interopRequireDefault(require('invariant'));

var _types = require('./types');

var _utils = require('./utils');

var _intlFormatCache = _interopRequireDefault(require('intl-format-cache'));

var _intlMessageformat = _interopRequireDefault(require('intl-messageformat'));

var _plural = _interopRequireDefault(require('./plural'));

var getNumberFormat = (0, _intlFormatCache.default)(Intl.NumberFormat);
var getDateTimeFormat = (0, _intlFormatCache.default)(Intl.DateTimeFormat);
var getMessageFormat = (0, _intlFormatCache.default)(_intlMessageformat.default);
var getRelativeFormat = (0, _intlFormatCache.default)(_intlRelativeformat.default);
var getPluralFormat = (0, _intlFormatCache.default)(_plural.default);
var DATE_TIME_FORMAT_OPTIONS = Object.keys(_types.dateTimeFormatPropTypes);
var NUMBER_FORMAT_OPTIONS = Object.keys(_types.numberFormatPropTypes);
var RELATIVE_FORMAT_OPTIONS = Object.keys(_types.relativeFormatPropTypes);
var PLURAL_FORMAT_OPTIONS = Object.keys(_types.pluralFormatPropTypes);
var RELATIVE_FORMAT_THRESHOLDS = {
  second: 60,
  // seconds to minute
  minute: 60,
  // minutes to hour
  hour: 24,
  // hours to day
  day: 30,
  // days to month
  month: 12 // months to year
};

var updateRelativeFormatThresholds = function updateRelativeFormatThresholds(newThresholds) {
  var thresholds = _intlRelativeformat.default.thresholds;
  thresholds.second = newThresholds.second;
  thresholds.minute = newThresholds.minute;
  thresholds.hour = newThresholds.hour;
  thresholds.day = newThresholds.day;
  thresholds.month = newThresholds.month;
  thresholds['second-short'] = newThresholds['second-short'];
  thresholds['minute-short'] = newThresholds['minute-short'];
  thresholds['hour-short'] = newThresholds['hour-short'];
  thresholds['day-short'] = newThresholds['day-short'];
  thresholds['month-short'] = newThresholds['month-short'];
};

var getNamedFormat = function getNamedFormat(formats, type, name, onError) {
  var format = formats && formats[type] && formats[type][name];

  if (format) {
    return format;
  }

  onError((0, _utils.createError)('No '.concat(type, ' format named: ').concat(name)));
};

var formatDate = function formatDate(config) {
  return function(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var locale = config.locale,
      formats = config.formats,
      timeZone = config.timeZone;
    var format = options.format;
    var onError = config.onError || _utils.defaultErrorHandler;
    var date = new Date(value);
    var defaults = (0, _objectSpread2.default)(
      {},
      timeZone && {
        timeZone: timeZone
      },
      format && getNamedFormat(formats, 'date', format, onError)
    );
    var filteredOptions = (0, _utils.filterProps)(options, DATE_TIME_FORMAT_OPTIONS, defaults);

    try {
      return getDateTimeFormat(locale, filteredOptions).format(date);
    } catch (e) {
      onError((0, _utils.createError)('Error formatting date.', e));
    }

    return String(date);
  };
};

exports.formatDate = formatDate;

var formatTime = function formatTime(config) {
  return function(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var locale = config.locale,
      formats = config.formats,
      timeZone = config.timeZone;
    var format = options.format;
    var onError = config.onError || _utils.defaultErrorHandler;
    var date = new Date(value);
    var defaults = (0, _objectSpread2.default)(
      {},
      timeZone && {
        timeZone: timeZone
      },
      format && getNamedFormat(formats, 'time', format, onError)
    );
    var filteredOptions = (0, _utils.filterProps)(options, DATE_TIME_FORMAT_OPTIONS, defaults);

    if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
      // Add default formatting options if hour, minute, or second isn't defined.
      filteredOptions = (0, _objectSpread2.default)({}, filteredOptions, {
        hour: 'numeric',
        minute: 'numeric'
      });
    }

    try {
      return getDateTimeFormat(locale, filteredOptions).format(date);
    } catch (e) {
      onError((0, _utils.createError)('Error formatting time.', e));
    }

    return String(date);
  };
};

exports.formatTime = formatTime;

var formatRelative = function formatRelative(config) {
  return function(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var locale = config.locale,
      formats = config.formats;
    var format = options.format;
    var onError = config.onError || _utils.defaultErrorHandler;
    var date = new Date(value);
    var now = new Date(options.now);
    var defaults = format && getNamedFormat(formats, 'relative', format, onError);
    var filteredOptions = (0, _utils.filterProps)(options, RELATIVE_FORMAT_OPTIONS, defaults); // Capture the current threshold values, then temporarily override them with
    // specific values just for this render.

    var oldThresholds = (0, _objectSpread2.default)({}, _intlRelativeformat.default.thresholds);
    updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

    try {
      return getRelativeFormat(locale, filteredOptions).format(date, {
        now: isFinite(now) ? now : Date.now()
      });
    } catch (e) {
      onError((0, _utils.createError)('Error formatting relative time.', e));
    } finally {
      updateRelativeFormatThresholds(oldThresholds);
    }

    return String(date);
  };
};

exports.formatRelative = formatRelative;

var formatNumber = function formatNumber(config) {
  return function(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var locale = config.locale,
      formats = config.formats;
    var format = options.format;
    var onError = config.onError || _utils.defaultErrorHandler;
    var defaults = format && getNamedFormat(formats, 'number', format, onError);
    var filteredOptions = (0, _utils.filterProps)(options, NUMBER_FORMAT_OPTIONS, defaults);

    try {
      return getNumberFormat(locale, filteredOptions).format(value);
    } catch (e) {
      onError((0, _utils.createError)('Error formatting number.', e));
    }

    return String(value);
  };
};

exports.formatNumber = formatNumber;

var formatPlural = function formatPlural(config) {
  return function(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var locale = config.locale;
    var filteredOptions = (0, _utils.filterProps)(options, PLURAL_FORMAT_OPTIONS);
    var onError = config.onError || _utils.defaultErrorHandler;

    try {
      return getPluralFormat(locale, filteredOptions).format(value);
    } catch (e) {
      onError((0, _utils.createError)('Error formatting plural.', e));
    }

    return 'other';
  };
};

exports.formatPlural = formatPlural;

var formatMessage = function formatMessage(config) {
  return function() {
    var messageDescriptor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var locale = config.locale,
      formats = config.formats,
      messages = config.messages,
      defaultLocale = config.defaultLocale,
      defaultFormats = config.defaultFormats;
    var id = messageDescriptor.id,
      defaultMessage = messageDescriptor.defaultMessage;
    var message = messages && messages[id];
    var hasValues = Object.keys(values).length > 0; // `id` is a required field of a Message Descriptor.

    (0, _invariant.default)(id, '[React Intl] An `id` must be provided to format a message.'); // Avoid expensive message formatting for simple messages without values. In
    // development messages will always be formatted in case of missing values.

    if (!hasValues && process.env.NODE_ENV === 'production') {
      return message || defaultMessage || id;
    }

    var formattedMessage;
    var onError = config.onError || _utils.defaultErrorHandler;

    if (message) {
      try {
        var formatter = getMessageFormat(message, locale, formats);
        formattedMessage = formatter.format(values);
      } catch (e) {
        onError(
          (0, _utils.createError)(
            'Error formatting message: "'.concat(id, '" for locale: "').concat(locale, '"') +
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
          (0, _utils.createError)(
            'Missing message: "'.concat(id, '" for locale: "').concat(locale, '"') +
              (defaultMessage ? ', using default message as fallback.' : '')
          )
        );
      }
    }

    if (!formattedMessage && defaultMessage) {
      try {
        var _formatter = getMessageFormat(defaultMessage, defaultLocale, defaultFormats);

        formattedMessage = _formatter.format(values);
      } catch (e) {
        onError((0, _utils.createError)('Error formatting the default message for: "'.concat(id, '"'), e));
      }
    }

    if (!formattedMessage) {
      onError(
        (0, _utils.createError)(
          'Cannot format message: "'.concat(id, '", ') +
            'using message '.concat(message || defaultMessage ? 'source' : 'id', ' as fallback.')
        )
      );
    }

    return formattedMessage || message || defaultMessage || id;
  };
};

exports.formatMessage = formatMessage;

var formatHTMLMessage = function formatHTMLMessage(config) {
  return function(messageDescriptor) {
    var rawValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // Process all the values before they are used when formatting the ICU
    // Message string. Since the formatted message might be injected via
    // `innerHTML`, all String-based values need to be HTML-escaped.
    var escapedValues = Object.keys(rawValues).reduce(function(escaped, name) {
      var value = rawValues[name];
      escaped[name] = typeof value === 'string' ? (0, _utils.escape)(value) : value;
      return escaped;
    }, {});
    return formatMessage(config)(messageDescriptor, escapedValues);
  };
};

exports.formatHTMLMessage = formatHTMLMessage;
