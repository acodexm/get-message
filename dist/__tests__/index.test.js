'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _index = _interopRequireWildcard(require('../index'));

var _messages = _interopRequireDefault(require('./messages'));

var getMessage = (0, _index.default)('test');
describe('test all', function() {
  beforeAll(function() {
    return _index.MessageProvider.initialize({
      locale: 'en_EN',
      messages: _messages.default['en_EN']
    });
  });
  test('get normal translation', function() {
    expect(getMessage('default')).toBe('normal translation');
  });
  test('get  translation with variables', function() {
    var date = new Date();
    expect(
      getMessage('variables', {
        var1: 'STRING',
        var2: 1234,
        var3: date
      })
    ).toBe('first variable STRING second 1234 third '.concat(date, ' end of translation')); //change language in this point

    _index.MessageProvider.initialize({
      locale: 'en',
      messages: _messages.default['en']
    });
  });
  test('get normal translation CAPITALIZED', function() {
    expect(getMessage('default')).toBe('NORMAL TRANSLATION');
  });
  test('get  translation with variables CAPITALIZED', function() {
    var date = new Date();
    expect(
      getMessage('variables', {
        var1: 'STRING',
        var2: 1234,
        var3: date
      })
    ).toBe('FIRST VARIABLE STRING SECOND 1234 THIRD '.concat(date, ' END OF TRANSLATION'));
  });
  test('get HTML translation with variables CAPITALIZED', function() {
    var date = new Date();
    var getHtml = (0, _index.default)('test', 'html');
    expect(
      getHtml('html', {
        var1: '<strong>bold text</strong>',
        var2: 1234,
        var3: date
      })
    ).toBe(
      '<div>FIRST VARIABLE &lt;strong&gt;bold text&lt;/strong&gt; SECOND 1234 THIRD '.concat(
        date,
        ' END OF TRANSLATION</div>'
      )
    );
  });
});
