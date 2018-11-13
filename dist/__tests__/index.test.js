'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _react = _interopRequireDefault(require('react'));

var _index = _interopRequireWildcard(require('../index'));

var _intlRelativeformat = _interopRequireDefault(require('intl-relativeformat'));

var _plural = _interopRequireDefault(require('../plural'));

var messages = {
  en: {
    'test.default': 'normal translation',
    'test.variables': 'first variable {var1} second {var2} third {var3} end of translation',
    'test.html': 'first variable {var1} second {var2} third {var3} end of translation'
  },
  pl: {
    'test.default': 'NORMAL TRANSLATION',
    'test.variables': 'FIRST VARIABLE {var1} SECOND {var2} THIRD {var3} END OF TRANSLATION',
    'test.html': 'FIRST VARIABLE {var1} SECOND {var2} THIRD {var3} END OF TRANSLATION'
  }
};
var getMessage = (0, _index.default)('test');
var getReact = (0, _index.default)('test', 'react');
var getDate = (0, _index.default)('test', 'date');
var getTime = (0, _index.default)('test', 'time');
var getNumber = (0, _index.default)('test', 'number');
var getPlural = (0, _index.default)('test', 'plural');
var getRelative = (0, _index.default)('test', 'relative');
var getHtml = (0, _index.default)('test', 'html');
describe('test all', function() {
  beforeAll(function() {
    return _index.MessageProvider.initialize({
      locale: 'en',
      messages: messages['en']
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
      locale: 'pl',
      messages: messages['pl']
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
    expect(
      getHtml('html', {
        var1: '<strong>bold text</strong>',
        var2: 1234,
        var3: date
      })
    ).toBe(
      'FIRST VARIABLE &lt;strong&gt;bold text&lt;/strong&gt; SECOND 1234 THIRD '.concat(date, ' END OF TRANSLATION')
    );
  });
  it('formatDate formats date ms timestamp values', function() {
    var df = new Intl.DateTimeFormat('pl');
    var timestamp = Date.now();
    expect(getDate(timestamp)).toBe(df.format(timestamp));
  });
  it('formatTime formats date ms timestamp values', function() {
    var df = new Intl.DateTimeFormat('pl', {
      hour: 'numeric',
      minute: 'numeric'
    });
    var timestamp = Date.now();
    expect(getTime(timestamp)).toBe(df.format(timestamp));
  });
  it('formatRelative formats date ms timestamp values', function() {
    var rf = new _intlRelativeformat.default('pl');
    var timestamp = Date.now();
    expect(getRelative(timestamp)).toBe(
      rf.format(timestamp, {
        now: timestamp
      })
    );
  });
  it('formatNumber formats number values', function() {
    var nf = new Intl.NumberFormat('pl');
    expect(getNumber(1000)).toBe(nf.format(1000));
    expect(getNumber(1.1)).toBe(nf.format(1.1));
  });
  it('formatPlural formats decimal values', function() {
    var pf = new _plural.default('pl');
    expect(getPlural(0.1)).toBe(pf.format(0.1));
    expect(getPlural(1.0)).toBe(pf.format(1.0));
    expect(getPlural(1.1)).toBe(pf.format(1.1));
  });
  test('get REACT translation with variables CAPITALIZED', function() {
    _index.MessageProvider.initialize({
      locale: 'en',
      messages: messages['en']
    });

    expect(
      getReact('html', {
        var1: _react.default.createElement('strong', null, 'bold text'),
        var2: 1234,
        var3: 'date'
      })
    ).toEqual(
      _react.default.createElement(
        'span',
        null,
        'first variable ',
        _react.default.createElement('strong', null, 'bold text'),
        ' second 1234 third date end of translation'
      )
    );
  });
});
