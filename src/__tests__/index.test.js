import React from 'react';
import index, { MessageProvider } from '../index';
import IntlRelativeFormat from 'intl-relativeformat';
import IntlPluralFormat from '../plural';

const messages = {
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

const getMessage = index('test');
const getReact = index('test', 'react');
const getDate = index('test', 'date');
const getTime = index('test', 'time');
const getNumber = index('test', 'number');
const getPlural = index('test', 'plural');
const getRelative = index('test', 'relative');
const getHtml = index('test', 'html');

describe('test all', () => {
  beforeAll(() => MessageProvider.initialize({ locale: 'en', messages: messages['en'] }));

  test('get normal translation', () => {
    expect(getMessage('default')).toBe('normal translation');
  });

  test('get  translation with variables', () => {
    const date = new Date();
    expect(getMessage('variables', { var1: 'STRING', var2: 1234, var3: date })).toBe(
      `first variable STRING second 1234 third ${date} end of translation`
    );
    //change language in this point
    MessageProvider.initialize({ locale: 'pl', messages: messages['pl'] });
  });

  test('get normal translation CAPITALIZED', () => {
    expect(getMessage('default')).toBe('NORMAL TRANSLATION');
  });

  test('get  translation with variables CAPITALIZED', () => {
    const date = new Date();
    expect(getMessage('variables', { var1: 'STRING', var2: 1234, var3: date })).toBe(
      `FIRST VARIABLE STRING SECOND 1234 THIRD ${date} END OF TRANSLATION`
    );
  });

  test('get HTML translation with variables CAPITALIZED', () => {
    const date = new Date();
    expect(getHtml('html', { var1: '<strong>bold text</strong>', var2: 1234, var3: date })).toBe(
      `FIRST VARIABLE &lt;strong&gt;bold text&lt;/strong&gt; SECOND 1234 THIRD ${date} END OF TRANSLATION`
    );
  });

  it('formatDate formats date ms timestamp values', () => {
    const df = new Intl.DateTimeFormat('pl');

    const timestamp = Date.now();
    expect(getDate(timestamp)).toBe(df.format(timestamp));
  });

  it('formatTime formats date ms timestamp values', () => {
    const df = new Intl.DateTimeFormat('pl', {
      hour: 'numeric',
      minute: 'numeric'
    });
    const timestamp = Date.now();
    expect(getTime(timestamp)).toBe(df.format(timestamp));
  });

  it('formatRelative formats date ms timestamp values', () => {
    const rf = new IntlRelativeFormat('pl');

    const timestamp = Date.now();
    expect(getRelative(timestamp)).toBe(rf.format(timestamp, { now: timestamp }));
  });

  it('formatNumber formats number values', () => {
    const nf = new Intl.NumberFormat('pl');

    expect(getNumber(1000)).toBe(nf.format(1000));
    expect(getNumber(1.1)).toBe(nf.format(1.1));
  });

  it('formatPlural formats decimal values', () => {
    const pf = new IntlPluralFormat('pl');

    expect(getPlural(0.1)).toBe(pf.format(0.1));
    expect(getPlural(1.0)).toBe(pf.format(1.0));
    expect(getPlural(1.1)).toBe(pf.format(1.1));
  });

  test('get REACT translation with variables CAPITALIZED', () => {
    MessageProvider.initialize({ locale: 'en', messages: messages['en'] });
    expect(getReact('html', { var1: <strong>bold text</strong>, var2: 1234, var3: 'date' })).toEqual(
      <span>
        first variable <strong>bold text</strong> second 1234 third date end of translation
      </span>
    );
  });
});
