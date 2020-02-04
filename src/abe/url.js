const isHardcover = n => /hardcover|hardback|^hb$|^hc$|^h$/i.test(n);
const isSoftcover = n => /softcover|paperback|^pb$|^p$|^s$/i.test(n);
const URL_PREFIX = 'https://www.abebooks.com/servlet/SearchResults?bx=off&ds=50&recentlyadded=all&sortby=17&sts=t';

module.exports = (opts) => {
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
                    if(!isNaN(val) && val < new Date().getFullYear()) {
                        next = '&yrh=' + val;
                    }
                    break;
                case 'format':
                    next = '&bi=' + (isHardcover(val) ? 'h' : isSoftcover(val) ? 's' : '0');
                    break;
            }
            return coll + next;
        }, URL_PREFIX);
};
