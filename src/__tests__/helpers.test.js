import helpers from '../helpers';

const timeStamp = 1390518044403;
const {
  intl,
  intlGet,
  formatDate,
  formatTime,
  formatNumber,
  formatMessage,
  formatRelative,
  formatHTMLMessage
} = helpers;

const intlBlock = (content, options) => {
  let hash = [],
    option,
    open,
    close;

  for (option in options) {
    if (options.hasOwnProperty(option)) {
      hash.push(option + '=' + '"' + options[option] + '"');
    }
  }

  open = '{{#intl ' + hash.join(' ') + '}}';
  close = '{{/intl}}';

  return Handlebars.compile(open + content + close);
};

describe('Helper `formatNumber`', () => {
  it('should be added to Handlebars', () => {
    expect(helpers).toHaveProperty('formatNumber');
  });

  it('should be a function', () => {
    expect(typeof helpers.formatNumber).toBe('function');
  });

  it('should throw if called with out a value', () => {
    expect(() => formatNumber()).toThrow(TypeError);
  });

  describe('used to format numbers', () => {
    it('should return a string', () => {
      expect(formatNumber(4, { locales: 'en-US' })).toBe('4');
    });

    it('should return a decimal as a string', () => {
      const tmpl = intlBlock('{{formatNumber NUM}}', { locales: 'en-US' });
      expect(tmpl({ NUM: 4.004 })).toBe('4.004');
    });

    it('should return a formatted string with a thousand separator', () => {
      const tmpl = intlBlock('{{formatNumber NUM}}', { locales: 'en-US' });
      expect(tmpl({ NUM: 40000 })).toBe('40,000');
    });

    it('should return a formatted string with a thousand separator and decimal', () => {
      const tmpl = intlBlock('{{formatNumber NUM}}', { locales: 'en-US' });
      expect(tmpl({ NUM: 40000.004 })).toBe('40,000.004');
    });

    describe('in another locale', () => {
      it('should return a string', () => {
        const tmpl = intlBlock('{{formatNumber 4}}', { locales: 'de-DE' });
        expect(tmpl()).toBe('4');
      });

      it('should return a decimal as a string', () => {
        const tmpl = intlBlock('{{formatNumber NUM}}', { locales: 'de-DE' });
        expect(tmpl({ NUM: 4.004 })).toBe('4,004');
      });

      it('should return a formatted string with a thousand separator', () => {
        const tmpl = intlBlock('{{formatNumber NUM}}', { locales: 'de-DE' });
        expect(tmpl({ NUM: 40000 })).toBe('40.000');
      });

      it('should return a formatted string with a thousand separator and decimal', () => {
        const tmpl = intlBlock('{{formatNumber NUM}}', { locales: 'de-DE' });
        expect(tmpl({ NUM: 40000.004 })).toBe('40.000,004');
      });
    });
  });

  describe('used to format currency', () => {
    it('should return a string formatted to currency', () => {
      let tmpl;

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency="USD"}}', { locales: 'en-US' });
      expect(tmpl()).toBe('$40,000.00');

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency="EUR"}}', { locales: 'en-US' });
      expect(tmpl()).toBe('€40,000.00');

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency="JPY"}}', { locales: 'en-US' });
      expect(tmpl()).toBe('¥40,000');
    });

    it('should return a string formatted to currency with code', () => {
      let tmpl;

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency="USD" currencyDisplay="code"}}', {
        locales: 'en-US'
      });
      expect(tmpl()).toBe('USD40,000.00');

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency="EUR" currencyDisplay="code"}}', {
        locales: 'en-US'
      });
      expect(tmpl()).toBe('EUR40,000.00');

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency="JPY" currencyDisplay="code"}}', {
        locales: 'en-US'
      });
      expect(tmpl()).toBe('JPY40,000');
    });

    it('should function within an `each` block helper', () => {
      const tmpl = intlBlock(
          '{{#each currencies}} {{formatNumber AMOUNT style="currency" currency=CURRENCY}}{{/each}}',
          { locales: 'en-US' }
        ),
        out = tmpl({
          currencies: [{ AMOUNT: 3, CURRENCY: 'USD' }, { AMOUNT: 8, CURRENCY: 'EUR' }, { AMOUNT: 10, CURRENCY: 'JPY' }]
        });

      // note the output must contain the correct spaces to match the template
      expect(out).toBe(' $3.00 €8.00 ¥10');
    });

    it('should return a currency even when using a different locale', () => {
      let tmpl = intlBlock('{{formatNumber 40000 style="currency" currency=CURRENCY}}', { locales: 'de-DE' }),
        out = tmpl({ CURRENCY: 'USD' });

      expect(out, 'USD->de-DE').toBe('40.000,00 $');

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency=CURRENCY}}', { locales: 'de-DE' });
      out = tmpl({ CURRENCY: 'EUR' });
      expect(out, 'EUR->de-DE').toBe('40.000,00 €');

      tmpl = intlBlock('{{formatNumber 40000 style="currency" currency=CURRENCY}}', { locales: 'de-DE' });
      out = tmpl({ CURRENCY: 'JPY' });
      expect(out, 'JPY->de-DE').toBe('40.000 ¥');
    });
  });

  describe('used to format percentages', () => {
    it('should return a string formatted to a percent', () => {
      const tmpl = intlBlock('{{formatNumber 400 style="percent"}}', { locales: 'en-US' });
      expect(tmpl()).toBe('40,000%');
    });

    it('should return a percentage when using a different locale', () => {
      const tmpl = intlBlock('{{formatNumber 400 style="percent"}}', { locales: 'de-DE' });
      expect(tmpl()).toBe('40.000 %');
    });
  });
});

describe('Helper `formatDate`', () => {
  it('should be added to Handlebars', () => {
    expect(helpers).toHaveProperty('formatDate');
  });

  it('should be a function', () => {
    expect(helpers.formatDate).toBe('function');
  });

  it('should throw if called with out a value', () => {
    expect(() => formatDate()).toThrow(TypeError);
  });

  // Use a fixed known date
  const dateStr = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
    timeStamp = 1390518044403;

  it('should return a formatted string', () => {
    let tmpl = intlBlock('{{formatDate "' + dateStr + '"}}', { locales: 'en-US' });
    expect(tmpl()).toBe('1/23/2014');

    // note timestamp is passed as a number
    tmpl = intlBlock('{{formatDate ' + timeStamp + '}}', { locales: 'en-US' });
    expect(tmpl()).toBe('1/23/2014');
  });

  it('should return a formatted string of just the time', () => {
    const tmpl = intlBlock('{{formatDate ' + timeStamp + ' hour="numeric" minute="numeric" timeZone="UTC"}}', {
      locales: 'en-US'
    });
    expect(tmpl()).toBe('11:00 PM');
  });

  it('should format the epoch timestamp', () => {
    const tmpl = intlBlock('{{formatDate 0}}', { locales: 'en-US' });
    expect(tmpl()).toBe(new Intl.DateTimeFormat('en').format(0));
  });
});

describe('Helper `formatTime`', () => {
  it('should be added to Handlebars', () => {
    expect(helpers).toHaveProperty('formatTime');
  });

  it('should be a function', () => {
    expect(helpers.formatTime).toBe('function');
  });

  it('should throw if called with out a value', () => {
    expect(formatTime()).toThrow(TypeError);
  });

  // Use a fixed known date
  const dateStr = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
    timeStamp = 1390518044403;

  it('should return a formatted string', () => {
    let tmpl = intlBlock('{{formatTime "' + dateStr + '"}}', { locales: 'en-US' });
    expect(tmpl()).toBe('1/23/2014');

    // note timestamp is passed as a number
    tmpl = intlBlock('{{formatTime ' + timeStamp + '}}', { locales: 'en-US' });
    expect(tmpl()).toBe('1/23/2014');
  });

  it('should return a formatted string of just the time', () => {
    const tmpl = intlBlock('{{formatTime ' + timeStamp + ' hour="numeric" minute="numeric" timeZone="UTC"}}', {
      locales: 'en-US'
    });
    expect(tmpl()).toBe('11:00 PM');
  });
});

describe('Helper `formatRelative`', () => {
  it('should be added to Handlebars', () => {
    expect(helpers).toHaveProperty('formatRelative');
  });

  it('should be a function', () => {
    expect(helpers.formatRelative).toBe('function');
  });

  it('should throw if called with out a value', () => {
    expect(formatRelative()).toThrow(TypeError);
  });

  const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;

  it('should return a formatted string', () => {
    const tmpl = intlBlock('{{formatRelative date}}', { locales: 'en-US' });
    expect(tmpl({ date: tomorrow })).toBe('tomorrow');
  });

  it('should accept formatting options', () => {
    const tmpl = intlBlock('{{formatRelative date style="numeric"}}', { locales: 'en-US' });
    expect(tmpl({ date: tomorrow })).toBe('in 1 day');
  });

  it('should accept a `now` option', () => {
    const tmpl = intlBlock('{{formatRelative 2000 now=1000}}', { locales: 'en-US' });
    expect(tmpl()).toBe('in 1 second');
  });

  it('should format the epoch timestamp', () => {
    const tmpl = intlBlock('{{formatRelative 0 now=1000}}', { locales: 'en-US' });
    expect(tmpl()).toBe('1 second ago');
  });
});

describe('Helper `formatMessage`', () => {
  it('should be added to Handlebars', () => {
    expect(helpers).toHaveProperty('formatMessage');
  });

  it('should be a function', () => {
    expect(helpers.formatMessage).toBe('function');
  });

  it('should throw if called with out a value', () => {
    expect(formatMessage()).toThrow(ReferenceError);
  });

  it('should return a formatted string', () => {
    const tmpl = intlBlock('{{formatMessage MSG firstName=firstName lastName=lastName}}', { locales: 'en-US' }),
      out = tmpl({
        MSG: 'Hi, my name is {firstName} {lastName}.',
        firstName: 'Anthony',
        lastName: 'Pipkin'
      });

    expect(out).toBe('Hi, my name is Anthony Pipkin.');
  });

  it('should return a formatted string with formatted numbers and dates', () => {
    const tmpl = intlBlock(
        '{{formatMessage POP_MSG city=city population=population census_date=census_date timeZone=timeZone}}',
        { locales: 'en-US' }
      ),
      out = tmpl({
        POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
        city: 'Atlanta',
        population: 5475213,
        census_date: new Date('1/1/2010').getTime(),
        timeZone: 'UTC'
      });

    expect(out).toBe('Atlanta has a population of 5,475,213 as of January 1, 2010.');
  });

  it('should return a formatted string with formatted numbers and dates in a different locale', () => {
    const tmpl = intlBlock(
        '{{formatMessage POP_MSG city=city population=population census_date=census_date timeZone=timeZone}}',
        { locales: 'de-DE' }
      ),
      out = tmpl({
        POP_MSG: '{city} hat eine Bevölkerung von {population, number, integer} zum {census_date, date, long}.',
        city: 'Atlanta',
        population: 5475213,
        census_date: new Date('1/1/2010'),
        timeZone: 'UTC'
      });

    expect(out).toBe('Atlanta hat eine Bevölkerung von 5.475.213 zum 1. Januar 2010.');
  });

  it('should return a formatted string with an `each` block', () => {
    const tmpl = intlBlock('{{#each harvest}} {{formatMessage ../HARVEST_MSG person=person count=count }}{{/each}}', {
        locales: 'en-US'
      }),
      out = tmpl({
        HARVEST_MSG: '{person} harvested {count, plural, one {# apple} other {# apples}}.',
        harvest: [{ person: 'Allison', count: 10 }, { person: 'Jeremy', count: 60 }]
      });

    expect(out).toBe(' Allison harvested 10 apples. Jeremy harvested 60 apples.');
  });

  it('should return a formatted `selectedordinal` message', () => {
    const tmpl = intlBlock('{{formatMessage BDAY_MSG year=year}}', { locales: 'en-US' });
    const out = tmpl({
      BDAY_MSG: 'This is my {year, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} birthday.',
      year: 3
    });

    expect(out).toBe('This is my 3rd birthday.');
  });
});

describe('Helper `intl`', () => {
  it('should be added to Handlebars', () => {
    expect(helpers).toHaveProperty('intl');
  });

  it('should be a function', () => {
    expect(helpers.intl).toBe('function');
  });

  describe('should provide formats', () => {
    it('for formatNumber', () => {
      const tmpl =
          '{{#intl formats=intl.formats locales="en-US"}}{{formatNumber NUM "usd"}} {{formatNumber NUM "eur"}} {{formatNumber NUM style="currency" currency="USD"}}{{/intl}}',
        ctx = {
          intl: {
            formats: {
              number: {
                eur: { style: 'currency', currency: 'EUR' },
                usd: { style: 'currency', currency: 'USD' }
              }
            }
          },
          NUM: 40000.004
        };
      expect(compile(tmpl)(ctx)).toBe('$40,000.00 €40,000.00 $40,000.00');
    });

    it('for formatDate', () => {
      const tmpl =
          '{{#intl formats=intl.formats locales="en-US"}}{{formatDate ' + timeStamp + ' "hm" timeZone="UTC"}}{{/intl}}',
        ctx = {
          intl: {
            formats: {
              date: {
                hm: { hour: 'numeric', minute: 'numeric' }
              }
            }
          }
        },
        d = new Date(timeStamp);
      expect(compile(tmpl)(ctx)).toBe('11:00 PM');
    });

    it('for formatMessage', () => {
      const tmpl =
          '{{#intl formats=intl.formats locales="en-US"}}{{formatMessage MSG product=PRODUCT price=PRICE deadline=DEADLINE timeZone=TZ}}{{/intl}}',
        ctx = {
          MSG: '{product} cost {price, number, usd} (or {price, number, eur}) if ordered by {deadline, date, long}',
          intl: {
            formats: {
              number: {
                eur: { style: 'currency', currency: 'EUR' },
                usd: { style: 'currency', currency: 'USD' }
              }
            }
          },
          PRODUCT: 'oranges',
          PRICE: 40000.004,
          DEADLINE: timeStamp,
          TZ: 'UTC'
        };
      expect(compile(tmpl)(ctx)).toBe('oranges cost $40,000.00 (or €40,000.00) if ordered by January 23, 2014');
    });
  });
});
