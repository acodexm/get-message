const rex = str => new RegExp(`{${str}}`, 'g');

export const Singleton = (() => {
    let instance;
    let messages;

    return {
        getInstance: translations => {
            if (translations) messages = translations;
            if (!instance) {
                return prefix => (id, options={}) => {
                    let result = messages[ `${prefix ? prefix + '.' : '' }${id}` ];
                    Object.keys(options).forEach(key => {
                        result = result.replace(rex(key), options[ key ]);
                    });
                    return result || id;
                };
            }
            return instance;
        },
    };
})();

export default Singleton.getInstance();