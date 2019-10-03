const fetch = require('@dillonchr/fetch');
const async = require('async');
const getUrl = require('./url.js');
const transformResponse = require('./response-transformer.js');

const apiFetch = (options, callback) => {
    fetch({url: getUrl(options)}, (err, body) => {
        if (err) {
            callback(err);
        } else {
            callback(null, {results: transformResponse(body)});
        }
    });
};

module.exports = (options, callback) => {
    try {
        options.sold = options.hasOwnProperty('sold') ? !!options.sold : true;
        options.live = options.hasOwnProperty('live');
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
