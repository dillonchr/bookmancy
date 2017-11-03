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
            let next = '';
            switch(key) {
                case 'publisher':
                    next = '&pn=' + encodeURIComponent(val);
                    break;
                case 'author': 
                    next = '&an=' + encodeURIComponent(val);
                    break;
                case 'title':
                    next = '&tn=' + encodeURIComponent(val);
                    break;
                case 'year':
                    if(val.length === 4 && !isNaN(val)) {
                        next = '&yrh=' + val;
                    }
                    break;
                case 'format':
                    next = '&bi=' + (_isHardcover(val) ? 'h' : _isSoftcover(val) ? 's' : '0');
                    break;
            }
            return coll + next;
        }, 'https://www.abebooks.com/servlet/SearchResults?bx=off&ds=50&recentlyadded=all&sortby=17&sts=t');
};

module.exports = {
    search(opts) {
        return _request(_getUrl(opts));
    },
    searchWithUrlInResponse(opts) {
        const url = _getUrl(opts);
        return _request(url)
            .then(results => ({results, url}));
    }
};
