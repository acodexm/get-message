const rex = str => new RegExp(`{${str}}`, 'g');

export const Singleton = (() => {
    let instance;
    let messages = {};
    const createInstance = () => {
        return (prefix) => (id, options = {}) => {
            let result = messages[ `${prefix ? prefix + '.' : ''}${id}` ];
            Object.keys(options).forEach((key) => {
                result = result.replace(rex(key), options[ key ]);
            });
            return result || id;
        };
    };

    return {
        getInstance(data) {
            if (data) messages = data;
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

export default Singleton.getInstance();