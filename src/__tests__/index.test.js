import index, { MessageProvider } from '../index';
import messages from './messages';

const getMessage = index('test');
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
});
