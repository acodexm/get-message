"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Singleton = void 0;

var rex = function rex(str) {
  return new RegExp("{".concat(str, "}"), 'g');
};

var Singleton = function () {
  var instance;
  var messages;
  return {
    getInstance: function getInstance(translations) {
      if (translations) messages = translations;

      if (!instance) {
        return function (prefix) {
          return function (id) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var result = messages["".concat(prefix ? prefix + '.' : '').concat(id)];
            Object.keys(options).forEach(function (key) {
              result = result.replace(rex(key), options[key]);
            });
            return result || id;
          };
        };
      }

      return instance;
    }
  };
}();

exports.Singleton = Singleton;

var _default = Singleton.getInstance();

exports.default = _default;