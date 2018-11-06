var rex = function(str) {
    return new RegExp('{' + str + '}', 'g');
};
var Singleton = (function() {
    var instance;
    var messages;

    var getInstance = function(translations) {
        if (translations) messages = translations;
        if (!instance) {
            return function(prefix) {
                return function(id, options) {
                    var result = messages[ prefix + id ];
                    Object.keys(options).forEach(function(key) {
                        result = result.replace(rex(key), options[ key ]);
                    });
                    return result || id;
                };
            };
        }
        return instance;
    };
})();

exports.GetMessage =function(translations){
    return Singleton.getInstance(translations)
}