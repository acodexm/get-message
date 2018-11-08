'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = exports.MessageProvider = void 0;

var rex = function rex(str) {
  return new RegExp('{'.concat(str, '}'), 'g');
};

var MessageProvider = (function() {
  var instance;
  var messages = {};

  var createInstance = function createInstance() {
    return function(prefix) {
      return function(id) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var result = messages[''.concat(prefix ? prefix + '.' : '').concat(id)];
        Object.keys(options).forEach(function(key) {
          result = result.replace(rex(key), options[key]);
        });
        return result || id;
      };
    };
  };

  return {
    initialize: function initialize(data) {
      if (data) messages = data;

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
