const http = require('http');
const async = require('async');
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
                    callback(null, {results: transformResponse(parsed)});
                } catch (err) {
                    callback(err);
                }
            })
            .on('error', callback);
    });
};

module.exports = (options, callback) => {
    try {
        options.sold = options.hasOwnProperty('sold') ? !!options.sold : true;
        options.live = options.hasOwnProperty('live')
        if (!!options.sold === !!options.live) {
            async.series([
                fn => apiFetch({...options, sold: false, live: true}, fn),
                fn => apiFetch({...options, sold: true, live: false}, fn)
            ], (err, superResults) => {
                if (err) {
                    callback(err);
                } else {
                    const results = superResults.reduce((collection, data) => {
                        return collection.concat(data.results);
                    }, []);
                    callback(null, {results});
                }
            });
        } else {
            apiFetch(options, callback);
        }
    } catch (err) {
        callback(err);
    }
};
