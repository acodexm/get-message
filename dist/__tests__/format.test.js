'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'));

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _expect = _interopRequireWildcard(require('expect'));

var _intlMessageformat = _interopRequireDefault(require('intl-messageformat'));

var _intlRelativeformat = _interopRequireDefault(require('intl-relativeformat'));

var _types = require('../../src/types');

var f = _interopRequireWildcard(require('../../src/format'));

var _plural = _interopRequireDefault(require('../plural'));

describe('format API', function() {
  var NODE_ENV = process.env.NODE_ENV;
  var IRF_THRESHOLDS = (0, _objectSpread2.default)({}, _intlRelativeformat.default.thresholds);
  var consoleError;
  var config;
  beforeEach(function() {
    consoleError = (0, _expect.spyOn)(console, 'error');
    config = {
      locale: 'en',
      messages: {
        no_args: 'Hello, World!',
        with_arg: 'Hello, {name}!',
        with_named_format: 'It is {now, date, year-only}',
        with_html: 'Hello, <b>{name}</b>!',
        missing: undefined,
        empty: '',
        invalid: 'invalid {}',
        missing_value: 'missing {arg_missing}',
        missing_named_format: 'missing {now, date, format_missing}'
      },
      formats: {
        date: {
          'year-only': {
            year: 'numeric'
          },
          missing: undefined
        },
        time: {
          'hour-only': {
            hour: '2-digit',
            hour12: false
          },
          missing: undefined
        },
        relative: {
          seconds: {
            units: 'second'
          },
          missing: undefined
        },
        number: {
          percent: {
            style: 'percent',
            minimumFractionDigits: 2
          },
          missing: undefined
        }
      },
      defaultLocale: 'en',
      defaultFormats: {},
      onError: consoleError
    };
  });
  afterEach(function() {
    process.env.NODE_ENV = NODE_ENV;
    consoleError.restore();
  });
  describe('exports', function() {
    Object.keys(_types.intlFormatPropTypes).forEach(function(name) {
      it('exports `'.concat(name, '`'), function() {
        (0, _expect.default)((0, _typeof2.default)(f[name])).toBe('function');
      });
    });
  });
  describe('formatDate()', function() {
    var df;
    var formatDate;
    beforeEach(function() {
      df = new Intl.DateTimeFormat(config.locale);
      formatDate = f.formatDate(config);
    });
    it('fallsback and warns when no value is provided', function() {
      (0, _expect.default)(formatDate()).toBe('Invalid Date');
      (0, _expect.default)(consoleError.calls.length).toBe(1);
      (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
        '[React Intl] Error formatting date.\nRangeError'
      );
    });
    it('fallsback and warns when a non-finite value is provided', function() {
      (0, _expect.default)(formatDate(NaN)).toBe('Invalid Date');
      (0, _expect.default)(formatDate('')).toBe('Invalid Date');
      (0, _expect.default)(consoleError.calls.length).toBe(2);
    });
    it('formats falsy finite values', function() {
      (0, _expect.default)(formatDate(false)).toBe(df.format(false));
      (0, _expect.default)(formatDate(null)).toBe(df.format(null));
      (0, _expect.default)(formatDate(0)).toBe(df.format(0));
    });
    it('formats date instance values', function() {
      (0, _expect.default)(formatDate(new Date(0))).toBe(df.format(new Date(0)));
    });
    it('formats date string values', function() {
      (0, _expect.default)(formatDate(new Date(0).toString())).toBe(df.format(new Date(0)));
    });
    it('formats date ms timestamp values', function() {
      var timestamp = Date.now();
      (0, _expect.default)(formatDate(timestamp)).toBe(df.format(timestamp));
    });
    it('uses the time zone specified by the provider', function() {
      var timestamp = Date.now();
      config.timeZone = 'Pacific/Wake';
      formatDate = f.formatDate(config);
      var wakeDf = new Intl.DateTimeFormat(config.locale, {
        timeZone: 'Pacific/Wake'
      });
      (0, _expect.default)(formatDate(timestamp)).toBe(wakeDf.format(timestamp));
      config.timeZone = 'Asia/Shanghai';
      formatDate = f.formatDate(config);
      var shanghaiDf = new Intl.DateTimeFormat(config.locale, {
        timeZone: 'Asia/Shanghai'
      });
      (0, _expect.default)(formatDate(timestamp)).toBe(shanghaiDf.format(timestamp));
    });
    describe('options', function() {
      it('accepts empty options', function() {
        (0, _expect.default)(formatDate(0, {})).toBe(df.format(0));
      });
      it('accepts valid Intl.DateTimeFormat options', function() {
        (0, _expect.default)(function() {
          return formatDate(0, {
            year: 'numeric'
          });
        }).toNotThrow();
      });
      it('fallsback and warns on invalid Intl.DateTimeFormat options', function() {
        (0, _expect.default)(
          formatDate(0, {
            year: 'invalid'
          })
        ).toBe(String(new Date(0)));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting date.\nRangeError'
        );
      });
      it('uses configured named formats', function() {
        var date = new Date();
        var format = 'year-only';
        var _config = config,
          locale = _config.locale,
          formats = _config.formats;
        df = new Intl.DateTimeFormat(locale, formats.date[format]);
        (0, _expect.default)(
          formatDate(date, {
            format: format
          })
        ).toBe(df.format(date));
      });
      it('uses named formats as defaults', function() {
        var date = new Date();
        var opts = {
          month: 'numeric'
        };
        var format = 'year-only';
        var _config2 = config,
          locale = _config2.locale,
          formats = _config2.formats;
        df = new Intl.DateTimeFormat(locale, (0, _objectSpread2.default)({}, opts, formats.date[format]));
        (0, _expect.default)(
          formatDate(
            date,
            (0, _objectSpread2.default)({}, opts, {
              format: format
            })
          )
        ).toBe(df.format(date));
      });
      it('handles missing named formats and warns', function() {
        var date = new Date();
        var format = 'missing';
        df = new Intl.DateTimeFormat(config.locale);
        (0, _expect.default)(
          formatDate(date, {
            format: format
          })
        ).toBe(df.format(date));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toBe(
          '[React Intl] No date format named: '.concat(format)
        );
      });
      it('uses time zone specified in options over the one passed through by the provider', function() {
        var timestamp = Date.now();
        config.timeZone = 'Pacific/Wake';
        formatDate = f.formatDate(config);
        var shanghaiDf = new Intl.DateTimeFormat(config.locale, {
          timeZone: 'Asia/Shanghai'
        });
        (0, _expect.default)(
          formatDate(timestamp, {
            timeZone: 'Asia/Shanghai'
          })
        ).toBe(shanghaiDf.format(timestamp));
      });
    });
  });
  describe('formatTime()', function() {
    var df;
    var formatTime;
    beforeEach(function() {
      df = new Intl.DateTimeFormat(config.locale, {
        hour: 'numeric',
        minute: 'numeric'
      });
      formatTime = f.formatTime(config);
    });
    it('fallsback and warns when no value is provided', function() {
      (0, _expect.default)(formatTime()).toBe('Invalid Date');
      (0, _expect.default)(consoleError.calls.length).toBe(1);
      (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
        '[React Intl] Error formatting time.\nRangeError'
      );
    });
    it('fallsback and warns when a non-finite value is provided', function() {
      (0, _expect.default)(formatTime(NaN)).toBe('Invalid Date');
      (0, _expect.default)(formatTime('')).toBe('Invalid Date');
      (0, _expect.default)(consoleError.calls.length).toBe(2);
    });
    it('formats falsy finite values', function() {
      (0, _expect.default)(formatTime(false)).toBe(df.format(false));
      (0, _expect.default)(formatTime(null)).toBe(df.format(null));
      (0, _expect.default)(formatTime(0)).toBe(df.format(0));
    });
    it('formats date instance values', function() {
      (0, _expect.default)(formatTime(new Date(0))).toBe(df.format(new Date(0)));
    });
    it('formats date string values', function() {
      (0, _expect.default)(formatTime(new Date(0).toString())).toBe(df.format(new Date(0)));
    });
    it('formats date ms timestamp values', function() {
      var timestamp = Date.now();
      (0, _expect.default)(formatTime(timestamp)).toBe(df.format(timestamp));
    });
    it('uses the time zone specified by the provider', function() {
      var timestamp = Date.now();
      config.timeZone = 'Africa/Johannesburg';
      formatTime = f.formatTime(config);
      var johannesburgDf = new Intl.DateTimeFormat(config.locale, {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Africa/Johannesburg'
      });
      (0, _expect.default)(formatTime(timestamp)).toBe(johannesburgDf.format(timestamp));
      config.timeZone = 'America/Chicago';
      formatTime = f.formatTime(config);
      var chicagoDf = new Intl.DateTimeFormat(config.locale, {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'America/Chicago'
      });
      (0, _expect.default)(formatTime(timestamp)).toBe(chicagoDf.format(timestamp));
    });
    describe('options', function() {
      it('accepts empty options', function() {
        (0, _expect.default)(formatTime(0, {})).toBe(df.format(0));
      });
      it('accepts valid Intl.DateTimeFormat options', function() {
        (0, _expect.default)(function() {
          return formatTime(0, {
            hour: '2-digit'
          });
        }).toNotThrow();
      });
      it('fallsback and warns on invalid Intl.DateTimeFormat options', function() {
        (0, _expect.default)(
          formatTime(0, {
            hour: 'invalid'
          })
        ).toBe(String(new Date(0)));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting time.\nRangeError'
        );
      });
      it('uses configured named formats', function() {
        var date = new Date();
        var format = 'hour-only';
        var _config3 = config,
          locale = _config3.locale,
          formats = _config3.formats;
        df = new Intl.DateTimeFormat(locale, formats.time[format]);
        (0, _expect.default)(
          formatTime(date, {
            format: format
          })
        ).toBe(df.format(date));
      });
      it('uses named formats as defaults', function() {
        var date = new Date();
        var opts = {
          minute: '2-digit'
        };
        var format = 'hour-only';
        var _config4 = config,
          locale = _config4.locale,
          formats = _config4.formats;
        df = new Intl.DateTimeFormat(locale, (0, _objectSpread2.default)({}, opts, formats.time[format]));
        (0, _expect.default)(
          formatTime(
            date,
            (0, _objectSpread2.default)({}, opts, {
              format: format
            })
          )
        ).toBe(df.format(date));
      });
      it('handles missing named formats and warns', function() {
        var date = new Date();
        var format = 'missing';
        (0, _expect.default)(
          formatTime(date, {
            format: format
          })
        ).toBe(df.format(date));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toBe(
          '[React Intl] No time format named: '.concat(format)
        );
      });
      it('should set default values', function() {
        var date = new Date();
        var _config5 = config,
          locale = _config5.locale;
        var day = 'numeric';
        df = new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: 'numeric',
          day: day
        });
        (0, _expect.default)(
          formatTime(date, {
            day: day
          })
        ).toBe(df.format(date));
      });
      it('should not set default values when second is provided', function() {
        var date = new Date();
        var _config6 = config,
          locale = _config6.locale;
        var second = 'numeric';
        df = new Intl.DateTimeFormat(locale, {
          second: second
        });
        (0, _expect.default)(
          formatTime(date, {
            second: second
          })
        ).toBe(df.format(date));
      });
      it('should not set default values when minute is provided', function() {
        var date = new Date();
        var _config7 = config,
          locale = _config7.locale;
        var minute = 'numeric';
        df = new Intl.DateTimeFormat(locale, {
          minute: minute
        });
        (0, _expect.default)(
          formatTime(date, {
            minute: minute
          })
        ).toBe(df.format(date));
      });
      it('should not set default values when hour is provided', function() {
        var date = new Date();
        var _config8 = config,
          locale = _config8.locale;
        var hour = 'numeric';
        df = new Intl.DateTimeFormat(locale, {
          hour: hour
        });
        (0, _expect.default)(
          formatTime(date, {
            hour: hour
          })
        ).toBe(df.format(date));
      });
      it('uses time zone specified in options over the one passed through by the provider', function() {
        var timestamp = Date.now();
        config.timeZone = 'Africa/Johannesburg';
        formatTime = f.formatTime(config);
        var chicagoDf = new Intl.DateTimeFormat(config.locale, {
          hour: 'numeric',
          minute: 'numeric',
          timeZone: 'America/Chicago'
        });
        (0, _expect.default)(
          formatTime(timestamp, {
            timeZone: 'America/Chicago'
          })
        ).toBe(chicagoDf.format(timestamp));
      });
    });
  });
  describe('formatRelative()', function() {
    var now;
    var rf;
    var formatRelative;
    beforeEach(function() {
      now = Date.now();
      rf = new _intlRelativeformat.default(config.locale);
      formatRelative = f.formatRelative(config);
    });
    it('fallsback and warns when no value is provided', function() {
      (0, _expect.default)(formatRelative()).toBe('Invalid Date');
      (0, _expect.default)(consoleError.calls.length).toBe(1);
      (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
        '[React Intl] Error formatting relative time.\nRangeError'
      );
    });
    it('fallsback and warns when a non-finite value is provided', function() {
      (0, _expect.default)(formatRelative(NaN)).toBe('Invalid Date');
      (0, _expect.default)(formatRelative('')).toBe('Invalid Date');
      (0, _expect.default)(consoleError.calls.length).toBe(2);
    });
    it('formats falsy finite values', function() {
      (0, _expect.default)(formatRelative(false)).toBe(
        rf.format(false, {
          now: now
        })
      );
      (0, _expect.default)(formatRelative(null)).toBe(
        rf.format(null, {
          now: now
        })
      );
      (0, _expect.default)(formatRelative(0)).toBe(
        rf.format(0, {
          now: now
        })
      );
    });
    it('formats date instance values', function() {
      (0, _expect.default)(formatRelative(new Date(0))).toBe(
        rf.format(new Date(0), {
          now: now
        })
      );
    });
    it('formats date string values', function() {
      (0, _expect.default)(formatRelative(new Date(0).toString())).toBe(
        rf.format(new Date(0), {
          now: now
        })
      );
    });
    it('formats date ms timestamp values', function() {
      var timestamp = Date.now();
      (0, _expect.default)(formatRelative(timestamp)).toBe(
        rf.format(timestamp, {
          now: now
        })
      );
    });
    it('formats with short format', function() {
      var timestamp = now - 1000 * 59;
      (0, _expect.default)(
        formatRelative(timestamp, {
          units: 'second-short'
        })
      ).toBe('59 sec. ago');
    });
    it('formats with the expected thresholds', function() {
      var timestamp = now - 1000 * 59;
      (0, _expect.default)(_intlRelativeformat.default.thresholds).toEqual(IRF_THRESHOLDS);
      (0, _expect.default)(formatRelative(timestamp)).toNotBe(
        rf.format(timestamp, {
          now: now
        })
      );
      (0, _expect.default)(formatRelative(timestamp)).toBe('59 seconds ago');
      (0, _expect.default)(_intlRelativeformat.default.thresholds).toEqual(IRF_THRESHOLDS);
      (0, _expect.default)(formatRelative(NaN)).toBe('Invalid Date');
      (0, _expect.default)(_intlRelativeformat.default.thresholds).toEqual(IRF_THRESHOLDS);
    });
    describe('options', function() {
      it('accepts empty options', function() {
        (0, _expect.default)(formatRelative(0, {})).toBe(
          rf.format(0, {
            now: now
          })
        );
      });
      it('accepts valid IntlRelativeFormat options', function() {
        (0, _expect.default)(function() {
          return formatRelative(0, {
            units: 'second'
          });
        }).toNotThrow();
        (0, _expect.default)(function() {
          return formatRelative(0, {
            units: 'second-short'
          });
        }).toNotThrow();
      });
      it('falls back and warns on invalid IntlRelativeFormat options', function() {
        (0, _expect.default)(
          formatRelative(0, {
            units: 'invalid'
          })
        ).toBe(String(new Date(0)));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(
          consoleError.calls[0].arguments[0].startsWith(
            '[React Intl] Error formatting relative time.\nError: "invalid" is not a valid IntlRelativeFormat `units` value, it must be one of'
          )
        ).toBeTruthy();
      });
      it('uses configured named formats', function() {
        var date = -(1000 * 120);
        var format = 'seconds';
        var _config9 = config,
          locale = _config9.locale,
          formats = _config9.formats;
        rf = new _intlRelativeformat.default(locale, formats.relative[format]);
        (0, _expect.default)(
          formatRelative(date, {
            format: format
          })
        ).toBe(
          rf.format(date, {
            now: now
          })
        );
      });
      it('uses named formats as defaults', function() {
        var date = 0;
        var opts = {
          style: 'numeric'
        };
        var format = 'seconds';
        var _config10 = config,
          locale = _config10.locale,
          formats = _config10.formats;
        rf = new _intlRelativeformat.default(locale, (0, _objectSpread2.default)({}, opts, formats.relative[format]));
        (0, _expect.default)(
          formatRelative(
            date,
            (0, _objectSpread2.default)({}, opts, {
              format: format
            })
          )
        ).toBe(
          rf.format(date, {
            now: now
          })
        );
      });
      it('handles missing named formats and warns', function() {
        var date = new Date();
        var format = 'missing';
        rf = new _intlRelativeformat.default(config.locale);
        (0, _expect.default)(
          formatRelative(date, {
            format: format
          })
        ).toBe(
          rf.format(date, {
            now: now
          })
        );
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toBe(
          '[React Intl] No relative format named: '.concat(format)
        );
      });
      describe('now', function() {
        it('accepts a `now` option', function() {
          now = 1000;
          (0, _expect.default)(
            formatRelative(0, {
              now: now
            })
          ).toBe(
            rf.format(0, {
              now: now
            })
          );
        });
        it('does not throw or warn when a non-finite value is provided', function() {
          (0, _expect.default)(function() {
            return formatRelative(0, {
              now: NaN
            });
          }).toNotThrow();
          (0, _expect.default)(function() {
            return formatRelative(0, {
              now: ''
            });
          }).toNotThrow();
          (0, _expect.default)(consoleError.calls.length).toBe(0);
        });
        it('formats falsy finite values', function() {
          (0, _expect.default)(
            formatRelative(0, {
              now: false
            })
          ).toBe(
            rf.format(0, {
              now: false
            })
          );
          (0, _expect.default)(
            formatRelative(0, {
              now: null
            })
          ).toBe(
            rf.format(0, {
              now: null
            })
          );
          (0, _expect.default)(
            formatRelative(0, {
              now: 0
            })
          ).toBe(
            rf.format(0, {
              now: 0
            })
          );
        });
        it('formats date instance values', function() {
          now = new Date(1000);
          (0, _expect.default)(
            formatRelative(0, {
              now: now
            })
          ).toBe(
            rf.format(0, {
              now: now
            })
          );
        });
        it('formats date string values', function() {
          now = 1000;
          var dateString = new Date(now).toString();
          (0, _expect.default)(
            formatRelative(0, {
              now: dateString
            })
          ).toBe(
            rf.format(0, {
              now: now
            })
          );
        });
        it('formats date ms timestamp values', function() {
          now = 1000;
          (0, _expect.default)(
            formatRelative(0, {
              now: now
            })
          ).toBe(
            rf.format(0, {
              now: now
            })
          );
        });
      });
    });
  });
  describe('formatNumber()', function() {
    var nf;
    var formatNumber;
    beforeEach(function() {
      nf = new Intl.NumberFormat(config.locale);
      formatNumber = f.formatNumber(config);
    });
    it('returns "NaN" when no value is provided', function() {
      (0, _expect.default)(nf.format()).toBe('NaN');
      (0, _expect.default)(formatNumber()).toBe('NaN');
    });
    it('returns "NaN" when a non-number value is provided', function() {
      (0, _expect.default)(nf.format(NaN)).toBe('NaN');
      (0, _expect.default)(formatNumber(NaN)).toBe('NaN');
    });
    it('formats falsy values', function() {
      (0, _expect.default)(formatNumber(false)).toBe(nf.format(false));
      (0, _expect.default)(formatNumber(null)).toBe(nf.format(null));
      (0, _expect.default)(formatNumber('')).toBe(nf.format(''));
      (0, _expect.default)(formatNumber(0)).toBe(nf.format(0));
    });
    it('formats number values', function() {
      (0, _expect.default)(formatNumber(1000)).toBe(nf.format(1000));
      (0, _expect.default)(formatNumber(1.1)).toBe(nf.format(1.1));
    });
    it('formats string values parsed as numbers', function() {
      (0, _expect.default)(Number('1000')).toBe(1000);
      (0, _expect.default)(formatNumber('1000')).toBe(nf.format('1000'));
      (0, _expect.default)(Number('1.10')).toBe(1.1);
      (0, _expect.default)(formatNumber('1.10')).toBe(nf.format('1.10'));
    });
    describe('options', function() {
      it('accepts empty options', function() {
        (0, _expect.default)(formatNumber(1000, {})).toBe(nf.format(1000));
      });
      it('accepts valid Intl.NumberFormat options', function() {
        (0, _expect.default)(function() {
          return formatNumber(0, {
            style: 'percent'
          });
        }).toNotThrow();
      });
      it('fallsback and warns on invalid Intl.NumberFormat options', function() {
        (0, _expect.default)(
          formatNumber(0, {
            style: 'invalid'
          })
        ).toBe(String(0));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting number.\nRangeError'
        );
      });
      it('uses configured named formats', function() {
        var num = 0.505;
        var format = 'percent';
        var _config11 = config,
          locale = _config11.locale,
          formats = _config11.formats;
        nf = new Intl.NumberFormat(locale, formats.number[format]);
        (0, _expect.default)(
          formatNumber(num, {
            format: format
          })
        ).toBe(nf.format(num));
      });
      it('uses named formats as defaults', function() {
        var num = 0.500059;
        var opts = {
          maximumFractionDigits: 3
        };
        var format = 'percent';
        var _config12 = config,
          locale = _config12.locale,
          formats = _config12.formats;
        nf = new Intl.NumberFormat(locale, (0, _objectSpread2.default)({}, opts, formats.number[format]));
        (0, _expect.default)(
          formatNumber(
            num,
            (0, _objectSpread2.default)({}, opts, {
              format: format
            })
          )
        ).toBe(nf.format(num));
      });
      it('handles missing named formats and warns', function() {
        var num = 1000;
        var format = 'missing';
        nf = new Intl.NumberFormat(config.locale);
        (0, _expect.default)(
          formatNumber(num, {
            format: format
          })
        ).toBe(nf.format(num));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toBe(
          '[React Intl] No number format named: '.concat(format)
        );
      });
    });
  });
  describe('formatPlural()', function() {
    var pf;
    var formatPlural;
    beforeEach(function() {
      pf = new _plural.default(config.locale);
      formatPlural = f.formatPlural(config);
    });
    it('formats falsy values', function() {
      (0, _expect.default)(formatPlural(undefined)).toBe(pf.format(undefined));
      (0, _expect.default)(formatPlural(false)).toBe(pf.format(false));
      (0, _expect.default)(formatPlural(null)).toBe(pf.format(null));
      (0, _expect.default)(formatPlural(NaN)).toBe(pf.format(NaN));
      (0, _expect.default)(formatPlural('')).toBe(pf.format(''));
      (0, _expect.default)(formatPlural(0)).toBe(pf.format(0));
    });
    it('formats integer values', function() {
      (0, _expect.default)(formatPlural(0)).toBe(pf.format(0));
      (0, _expect.default)(formatPlural(1)).toBe(pf.format(1));
      (0, _expect.default)(formatPlural(2)).toBe(pf.format(2));
    });
    it('formats decimal values', function() {
      (0, _expect.default)(formatPlural(0.1)).toBe(pf.format(0.1));
      (0, _expect.default)(formatPlural(1.0)).toBe(pf.format(1.0));
      (0, _expect.default)(formatPlural(1.1)).toBe(pf.format(1.1));
    });
    it('formats string values parsed as numbers', function() {
      (0, _expect.default)(Number('0')).toBe(0);
      (0, _expect.default)(formatPlural('0')).toBe(pf.format('0'));
      (0, _expect.default)(Number('1')).toBe(1);
      (0, _expect.default)(formatPlural('1')).toBe(pf.format('1'));
      (0, _expect.default)(Number('0.1')).toBe(0.1);
      (0, _expect.default)(formatPlural('0.1')).toBe(pf.format('0.1'));
      (0, _expect.default)(Number('1.0')).toBe(1.0);
      (0, _expect.default)(formatPlural('1.0')).toBe(pf.format('1.0'));
    });
    describe('options', function() {
      it('accepts empty options', function() {
        (0, _expect.default)(formatPlural(0, {})).toBe(pf.format(0));
      });
      it('accepts valid IntlPluralFormat options', function() {
        (0, _expect.default)(function() {
          return formatPlural(22, {
            style: 'ordinal'
          });
        }).toNotThrow();
      });
      describe('ordinals', function() {
        it('formats using ordinal plural rules', function() {
          var opts = {
            style: 'ordinal'
          };
          pf = new _plural.default(config.locale, opts);
          (0, _expect.default)(formatPlural(22, opts)).toBe(pf.format(22));
        });
      });
    });
  });
  describe('formatMessage()', function() {
    var formatMessage;
    beforeEach(function() {
      formatMessage = f.formatMessage(config);
    });
    it('throws when no Message Descriptor is provided', function() {
      (0, _expect.default)(function() {
        return formatMessage();
      }).toThrow('[React Intl] An `id` must be provided to format a message.');
    });
    it('throws when Message Descriptor `id` is missing or falsy', function() {
      (0, _expect.default)(function() {
        return formatMessage({});
      }).toThrow('[React Intl] An `id` must be provided to format a message.');
      [undefined, null, false, 0, ''].forEach(function(id) {
        (0, _expect.default)(function() {
          return formatMessage({
            id: id
          });
        }).toThrow('[React Intl] An `id` must be provided to format a message.');
      });
    });
    it('formats basic messages', function() {
      var _config13 = config,
        locale = _config13.locale,
        messages = _config13.messages;
      var mf = new _intlMessageformat.default(messages.no_args, locale);
      (0, _expect.default)(
        formatMessage({
          id: 'no_args'
        })
      ).toBe(mf.format());
    });
    it('formats messages with placeholders', function() {
      var _config14 = config,
        locale = _config14.locale,
        messages = _config14.messages;
      var mf = new _intlMessageformat.default(messages.with_arg, locale);
      var values = {
        name: 'Eric'
      };
      (0, _expect.default)(
        formatMessage(
          {
            id: 'with_arg'
          },
          values
        )
      ).toBe(mf.format(values));
    });
    it('formats messages with named formats', function() {
      var _config15 = config,
        locale = _config15.locale,
        messages = _config15.messages,
        formats = _config15.formats;
      var mf = new _intlMessageformat.default(messages.with_named_format, locale, formats);
      var values = {
        now: Date.now()
      };
      (0, _expect.default)(
        formatMessage(
          {
            id: 'with_named_format'
          },
          values
        )
      ).toBe(mf.format(values));
    });
    it('avoids formatting when no values and in production', function() {
      var _config16 = config,
        messages = _config16.messages;
      process.env.NODE_ENV = 'production';
      (0, _expect.default)(
        formatMessage({
          id: 'no_args'
        })
      ).toBe(messages.no_args);
      var values = {
        foo: 'foo'
      };
      (0, _expect.default)(
        formatMessage(
          {
            id: 'no_args'
          },
          values
        )
      ).toBe(messages.no_args);
      process.env.NODE_ENV = 'development';
      (0, _expect.default)(
        formatMessage({
          id: 'no_args'
        })
      ).toBe(messages.no_args);
    });
    describe('fallbacks', function() {
      it('formats message with missing named formats', function() {
        var _config17 = config,
          locale = _config17.locale,
          messages = _config17.messages;
        var mf = new _intlMessageformat.default(messages.missing_named_format, locale);
        var values = {
          now: Date.now()
        };
        (0, _expect.default)(
          formatMessage(
            {
              id: 'missing_named_format'
            },
            values
          )
        ).toBe(mf.format(values));
      });
      it('formats `defaultMessage` when message is missing', function() {
        var _config18 = config,
          locale = _config18.locale,
          messages = _config18.messages;
        var mf = new _intlMessageformat.default(messages.with_arg, locale);
        var id = 'missing';
        var values = {
          name: 'Eric'
        };
        (0, _expect.default)(
          formatMessage(
            {
              id: id,
              defaultMessage: messages.with_arg
            },
            values
          )
        ).toBe(mf.format(values));
      });
      it('warns when `message` is missing and locales are different', function() {
        config.locale = 'fr';
        var _config19 = config,
          locale = _config19.locale,
          messages = _config19.messages,
          defaultLocale = _config19.defaultLocale;
        var mf = new _intlMessageformat.default(messages.with_arg, locale);
        var id = 'missing';
        var values = {
          name: 'Eric'
        };
        (0, _expect.default)(locale).toNotEqual(defaultLocale);
        (0, _expect.default)(
          formatMessage(
            {
              id: id,
              defaultMessage: messages.with_arg
            },
            values
          )
        ).toBe(mf.format(values));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Missing message: "'
            .concat(id, '" for locale: "')
            .concat(locale, '", using default message as fallback.')
        );
      });
      it('warns when `message` and `defaultMessage` are missing', function() {
        var _config20 = config,
          locale = _config20.locale,
          messages = _config20.messages;
        var id = 'missing';
        var values = {
          name: 'Eric'
        };
        (0, _expect.default)(
          formatMessage(
            {
              id: id,
              defaultMessage: messages.missing
            },
            values
          )
        ).toBe(id);
        (0, _expect.default)(consoleError.calls.length).toBe(2);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Missing message: "'.concat(id, '" for locale: "').concat(locale, '"')
        );
        (0, _expect.default)(consoleError.calls[1].arguments[0]).toContain(
          '[React Intl] Cannot format message: "'.concat(id, '", using message id as fallback.')
        );
      });
      it('formats `defaultMessage` when message has a syntax error', function() {
        var _config21 = config,
          locale = _config21.locale,
          messages = _config21.messages;
        var mf = new _intlMessageformat.default(messages.with_arg, locale);
        var id = 'invalid';
        var values = {
          name: 'Eric'
        };
        (0, _expect.default)(
          formatMessage(
            {
              id: id,
              defaultMessage: messages.with_arg
            },
            values
          )
        ).toBe(mf.format(values));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting message: "'
            .concat(id, '" for locale: "')
            .concat(locale, '", using default message as fallback.')
        );
      });
      it('formats `defaultMessage` when message has missing values', function() {
        var _config22 = config,
          locale = _config22.locale,
          messages = _config22.messages;
        var mf = new _intlMessageformat.default(messages.with_arg, locale);
        var id = 'missing_value';
        var values = {
          name: 'Eric'
        };
        (0, _expect.default)(
          formatMessage(
            {
              id: id,
              defaultMessage: messages.with_arg
            },
            values
          )
        ).toBe(mf.format(values));
        (0, _expect.default)(consoleError.calls.length).toBe(1);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting message: "'
            .concat(id, '" for locale: "')
            .concat(locale, '", using default message as fallback.')
        );
      });
      it('returns message source when message and `defaultMessage` have formatting errors', function() {
        var _config23 = config,
          locale = _config23.locale,
          messages = _config23.messages;
        var id = 'missing_value';
        (0, _expect.default)(
          formatMessage({
            id: id,
            defaultMessage: messages.invalid
          })
        ).toBe(messages[id]);
        (0, _expect.default)(consoleError.calls.length).toBe(3);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting message: "'.concat(id, '" for locale: "').concat(locale, '"')
        );
        (0, _expect.default)(consoleError.calls[1].arguments[0]).toContain(
          '[React Intl] Error formatting the default message for: "'.concat(id, '"')
        );
        (0, _expect.default)(consoleError.calls[2].arguments[0]).toContain(
          '[React Intl] Cannot format message: "'.concat(id, '", using message source as fallback.')
        );
      });
      it('returns message source when formatting error and missing `defaultMessage`', function() {
        var _config24 = config,
          locale = _config24.locale,
          messages = _config24.messages;
        var id = 'missing_value';
        (0, _expect.default)(
          formatMessage({
            id: id,
            defaultMessage: messages.missing
          })
        ).toBe(messages[id]);
        (0, _expect.default)(consoleError.calls.length).toBe(2);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Error formatting message: "'.concat(id, '" for locale: "').concat(locale, '"')
        );
        (0, _expect.default)(consoleError.calls[1].arguments[0]).toContain(
          '[React Intl] Cannot format message: "'.concat(id, '", using message source as fallback.')
        );
      });
      it('returns `defaultMessage` source when formatting errors and missing message', function() {
        config.locale = 'en-US';
        var _config25 = config,
          locale = _config25.locale,
          messages = _config25.messages;
        var id = 'missing';
        (0, _expect.default)(
          formatMessage({
            id: id,
            defaultMessage: messages.invalid
          })
        ).toBe(messages.invalid);
        (0, _expect.default)(consoleError.calls.length).toBe(3);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Missing message: "'
            .concat(id, '" for locale: "')
            .concat(locale, '", using default message as fallback.')
        );
        (0, _expect.default)(consoleError.calls[1].arguments[0]).toContain(
          '[React Intl] Error formatting the default message for: "'.concat(id, '"')
        );
        (0, _expect.default)(consoleError.calls[2].arguments[0]).toContain(
          '[React Intl] Cannot format message: "'.concat(id, '", using message source as fallback.')
        );
      });
      it('returns message `id` when message and `defaultMessage` are missing', function() {
        var id = 'missing';
        (0, _expect.default)(
          formatMessage({
            id: id
          })
        ).toBe(id);
        (0, _expect.default)(consoleError.calls.length).toBe(2);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Missing message: "'.concat(id, '" for locale: "').concat(config.locale, '"')
        );
        (0, _expect.default)(consoleError.calls[1].arguments[0]).toContain(
          '[React Intl] Cannot format message: "'.concat(id, '", using message id as fallback.')
        );
      });
      it('returns message `id` when message and `defaultMessage` are empty', function() {
        var _config26 = config,
          locale = _config26.locale,
          messages = _config26.messages;
        var id = 'empty';
        (0, _expect.default)(
          formatMessage({
            id: id,
            defaultMessage: messages[id]
          })
        ).toBe(id);
        (0, _expect.default)(consoleError.calls.length).toBe(2);
        (0, _expect.default)(consoleError.calls[0].arguments[0]).toContain(
          '[React Intl] Missing message: "'.concat(id, '" for locale: "').concat(locale, '"')
        );
        (0, _expect.default)(consoleError.calls[1].arguments[0]).toContain(
          '[React Intl] Cannot format message: "'.concat(id, '", using message id as fallback.')
        );
      });
    });
  });
  describe('formatHTMLMessage()', function() {
    var formatHTMLMessage;
    beforeEach(function() {
      formatHTMLMessage = f.formatHTMLMessage(config);
    });
    it('formats HTML messages', function() {
      var _config27 = config,
        locale = _config27.locale,
        messages = _config27.messages;
      var mf = new _intlMessageformat.default(messages.with_html, locale);
      var values = {
        name: 'Eric'
      };
      (0, _expect.default)(
        formatHTMLMessage(
          {
            id: 'with_html'
          },
          values
        )
      ).toBe(mf.format(values));
    });
    it('html-escapes string values', function() {
      var _config28 = config,
        locale = _config28.locale,
        messages = _config28.messages;
      var mf = new _intlMessageformat.default(messages.with_html, locale);
      var values = {
        name: '<i>Eric</i>'
      };
      var escapedValues = {
        name: '&lt;i&gt;Eric&lt;/i&gt;'
      };
      (0, _expect.default)(
        formatHTMLMessage(
          {
            id: 'with_html'
          },
          values
        )
      ).toBe(mf.format(escapedValues));
    });
  });
});
