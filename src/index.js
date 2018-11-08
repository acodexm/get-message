const rex = (str) => new RegExp(`{${str}}`, 'g');

export const MessageProvider = (() => {
  let instance;
  let messages = {};
  const createInstance = () => (prefix) => (id, options = {}) => {
    let result = messages[`${prefix ? `${prefix}.` : ''}${id}`];
    Object.keys(options).forEach((key) => {
      result = result.replace(rex(key), options[key]);
    });
    return result || id;
  };

  return {
    initialize: (data) => {
      if (data) messages = data;
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export default MessageProvider.initialize();
