'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = exports.MessageProvider = void 0;

var _react = _interopRequireDefault(require('react'));

var _utils = require('./utils');

var _format = require('./format');

var MessageProvider = (function() {
  var instance;
  var defaultProps = {
    formats: {},
    messages: {},
    timeZone: null,
    textComponent: 'span',
    defaultLocale: 'en',
    defaultFormats: {},
    onError: _utils.defaultErrorHandler
  };
  var config = (0, _utils.filterProps)(defaultProps, _utils.intlConfigPropNames);

  var createInstance = function createInstance() {
    return function(prefix, type) {
      var getMessage = function getMessage(fun) {
        return function(id, values) {
          return fun(config)(
            {
              id: ''.concat(prefix ? ''.concat(prefix, '.') : '').concat(id),
              defaultMessage: id
            },
            values
          );
        };
      };

      var getFormatted = function getFormatted(fun) {
        return function(value, options) {
          return fun(config)(value, options);
        };
      };

      switch (type) {
        case 'date': {
          return getFormatted(_format.formatDate);
        }

        case 'time': {
          return getFormatted(_format.formatTime);
        }

        case 'number': {
          return getFormatted(_format.formatNumber);
        }

        case 'plural': {
          return getFormatted(_format.formatPlural);
        }

        case 'relative': {
          return getFormatted(_format.formatRelative);
        }

        case 'html': {
          return getMessage(_format.formatHTMLMessage);
        }

        case 'react': {
          return getMessage(_format.formatReact);
        }

        default: {
          return getMessage(_format.formatMessage);
        }
      }
    };
  };

  return {
    initialize: function initialize(props) {
      if (props) config = (0, _utils.filterProps)(props, _utils.intlConfigPropNames, defaultProps);

      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  };
})();

exports.MessageProvider = MessageProvider;

var _default = MessageProvider.initialize();

exports.default = _default;
