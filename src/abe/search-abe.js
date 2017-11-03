const jsdom = require('jsdom');
const transformResponse = require('./response-transformer');
const _isHardcover = n => /hardcover|hardback|^hb$|^hc$|^h$/i.test(n);
const _isSoftcover = n => /softcover|paperback|^pb$|^p$|^s$/i.test(n);
const _request = url => {
    return new Promise((res, rej) => {
        jsdom.env(url, (err, w) => {
            if(!err) {
                res(transformResponse(w.document));
            } else {
                rej(err);
            }
        });
    });
};
const _getUrl = opts => {
    return Object.keys(opts)
        .reduce((coll, key) => {
            const val = opts[key];
            if (key === 'publisher') {
                return coll + '&pn=' + encodeURIComponent(val);
            }
            if (key === 'author') {
                return coll + '&an=' + encodeURIComponent(val);
            }
            if (key === 'title') {
                return coll + '&tn=' + encodeURIComponent(val);
            }
            if (key === 'year' && val.length === 4 && !isNaN(val)) {
                return coll + '&yrh=' + val;
            }
            if (key === 'format') {
                return coll + '&bi=' + (_isHardcover(val) ? 'h' : _isSoftcover(val) ? 's' : '0');
            }
           return coll;
        }, 'https://www.abebooks.com/servlet/SearchResults?bx=off&ds=50&recentlyadded=all&sortby=17&sts=t');
};

module.exports = {
    search(opts) {
        const url = _getUrl(opts);
        return _request(url)
            .then(results => ({results, url}));
    }
};
