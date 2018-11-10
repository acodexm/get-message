'use strict';

var _utils = require('../../src/utils');

describe('utils', function() {
  describe('createError', function() {
    it('should add exception message', function() {
      var e = new TypeError('unit test');
      expect((0, _utils.createError)('error message', e)).toEqual('[React Intl] error message\nTypeError: unit test');
      expect((0, _utils.createError)('error message')).toEqual('[React Intl] error message');
    });
  });
});
