import React from 'react';
import { defaultErrorHandler, filterProps, intlConfigPropNames } from './utils';
import {
  formatDate,
  formatHTMLMessage,
  formatMessage,
  formatNumber,
  formatPlural,
  formatReact,
  formatRelative,
  formatTime
} from './format';

export const MessageProvider = (() => {
  let instance;
  const defaultProps = {
    formats: {},
    messages: {},
    timeZone: null,
    textComponent: 'span',
    defaultLocale: 'en',
    defaultFormats: {},
    onError: defaultErrorHandler
  };

  let config = filterProps(defaultProps, intlConfigPropNames);

  const createInstance = () => (prefix, type) => {
    const getMessage = (fun) => (id, values) =>
      fun(config)({ id: `${prefix ? `${prefix}.` : ''}${id}`, defaultMessage: id }, values);

    const getFormatted = (fun) => (value, options) => fun(config)(value, options);

    switch (type) {
      case 'date': {
        return getFormatted(formatDate);
      }
      case 'time': {
        return getFormatted(formatTime);
      }
      case 'number': {
        return getFormatted(formatNumber);
      }
      case 'plural': {
        return getFormatted(formatPlural);
      }
      case 'relative': {
        return getFormatted(formatRelative);
      }
      case 'html': {
        return getMessage(formatHTMLMessage);
      }
      case 'react': {
        return getMessage(formatReact);
      }
      default: {
        return getMessage(formatMessage);
      }
    }
  };

  return {
    initialize: (props) => {
      if (props) config = filterProps(props, intlConfigPropNames, defaultProps);
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export default MessageProvider.initialize();
