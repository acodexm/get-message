import index, { MessageProvider } from '../index';
import messages from './messages';
import IntlRelativeFormat from 'intl-relativeformat';
import IntlPluralFormat from '../plural';

const getMessage = index('test');
const getDate = index('test', 'date');
const getTime = index('test', 'time');
const getNumber = index('test', 'number');
const getPlural = index('test', 'plural');
const getRelative = index('test', 'relative');

describe('test all', () => {
  beforeAll(() => MessageProvider.initialize({ locale: 'en_EN', messages: messages['en_EN'] }));

  test('get normal translation', () => {
    expect(getMessage('default')).toBe('normal translation');
  });

  test('get  translation with variables', () => {
    const date = new Date();
    expect(getMessage('variables', { var1: 'STRING', var2: 1234, var3: date })).toBe(
      `first variable STRING second 1234 third ${date} end of translation`
    );
    //change language in this point
    MessageProvider.initialize({ locale: 'en', messages: messages['en'] });
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
    const getHtml = index('test', 'html');
    expect(getHtml('html', { var1: '<strong>bold text</strong>', var2: 1234, var3: date })).toBe(
      `<div>FIRST VARIABLE &lt;strong&gt;bold text&lt;/strong&gt; SECOND 1234 THIRD ${date} END OF TRANSLATION</div>`
    );
  });

  it('formatDate formats date ms timestamp values', () => {
    const df = new Intl.DateTimeFormat('en');

    const timestamp = Date.now();
    expect(getDate(timestamp)).toBe(df.format(timestamp));
  });

  it('formatTime formats date ms timestamp values', () => {
    const df = new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: 'numeric'
    });
    const timestamp = Date.now();
    expect(getTime(timestamp)).toBe(df.format(timestamp));
  });

  it('formatRelative formats date ms timestamp values', () => {
    const rf = new IntlRelativeFormat('en');

    const timestamp = Date.now();
    expect(getRelative(timestamp)).toBe(rf.format(timestamp, { now: timestamp }));
  });

  it('formatNumber formats number values', () => {
    const nf = new Intl.NumberFormat('en');

    expect(getNumber(1000)).toBe(nf.format(1000));
    expect(getNumber(1.1)).toBe(nf.format(1.1));
  });

  it('formatPlural formats decimal values', () => {
    const pf = new IntlPluralFormat('en');

    expect(getPlural(0.1)).toBe(pf.format(0.1));
    expect(getPlural(1.0)).toBe(pf.format(1.0));
    expect(getPlural(1.1)).toBe(pf.format(1.1));
  });
});
