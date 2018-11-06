import index, { Singleton } from '../index';
import messages from './messages';

const getMessage = index('test');
describe('test all', () => {
        beforeAll(() =>
            Singleton.getInstance(messages[ 'en_EN' ])
        );
        test('get normal translation', () => {
            expect(getMessage('default')).toBe('normal translation');
        });
        test('get  translation with variables', () => {
            const date = new Date();
            expect(getMessage('variables', { var1: 'STRING', var2: 1234, var3: date })).
                toBe(`first variable STRING second 1234 third ${date} end of translation`);
            //change language in this point
            Singleton.getInstance(messages[ 'en' ])
        });

        test('get normal translation CAPITALIZED', () => {
            expect(getMessage('default')).toBe('NORMAL TRANSLATION');
        });
        test('get  translation with variables CAPITALIZED', () => {
            const date = new Date();
            expect(getMessage('variables', { var1: 'STRING', var2: 1234, var3: date })).
                toBe(`FIRST VARIABLE STRING SECOND 1234 THIRD ${date} END OF TRANSLATION`);
        });
    },
);