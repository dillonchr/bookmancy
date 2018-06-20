const domget = require('@dillonchr/domget');
const transformResponse = require('./response-transformer.js');
const getUrl = require('./url.js');

module.exports = (options, callback) => {
    const url = getUrl(options);
    domget(url, (err, dom) => {
        if (err) {
            callback(err);
        } else {
            const results = transformResponse(dom);
            const abeResults = {results};
            if (options.includeUrl) {
                abeResults.url = url;
            }
            callback(null, abeResults);     
        }
    });
};
