const http = require('http');
const getUrl = require('./url.js');
const transformResponse = require('./response-transformer.js');

const apiFetch = (options, callback) => {
    http.get(getUrl(options), res => {
        let body = '';
        res
            .on('data', d => body += d)
            .on('end', () => {
                try {
                    const data = body.trim();
                    const parsed = JSON.parse(data.substr(7, data.length - 8));
                    callback(null, transformResponse(parsed));
                } catch (err) {
                    callback(err);
                }
            })
            .on('error', callback);
    });
};

module.exports = (options, callback) => {
    try {
        apiFetch(options, callback);
    } catch (err) {
        callback(err);
    }
};

module.exports({author: 'capote', publisher: 'random', title: 'in cold blood', year: 1965, includeUrl: true}, console.log.bind(this, 'RES'));