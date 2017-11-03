require('dotenv').config();
const http = require('http');
const toResult = require('../result-model');
const API_KEY = process.env.EBAY_API_KEY;
const SELLING_STATUSES = {
    SOLD: 'EndedWithSales',
    LIVE: 'Active'
};
const sellingStatuses = Object.keys(SELLING_STATUSES)
    .map(k => SELLING_STATUSES[k]);
const _request = url => {
    return new Promise((resolve, reject) => http.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
            try {
                const data = body.trim();
                const parsed = JSON.parse(data.substr(7, data.length - 8));
                resolve(parsed);
            } catch (err) {
                reject(err);
            }
        });
    }));
};
const _buildApiUrl = ({controller, filters = [], q}) => {
    const filtersQuery = [{
        name: 'HideDuplicateItems',
        value: 'true'
    }]
        .concat(filters)
        .reduce((str, {name, value}, i) => {
            const v = `&itemFilter(${i})`;
            return `${str}${v}.name=${name}${v}.value=${value}`;
        }, '');
    return `http://svcs.ebay.com/services/search/FindingService/v1?callback=fn&OPERATION-NAME=${controller}&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${API_KEY}&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD${filtersQuery}&paginationInput.entriesPerPage=100&sortOrder=PricePlusShippingHighest&categoryId=267&keywords=${encodeURIComponent(q)}`;
};
const _apiFetch = options => {
    if (!API_KEY) {
        return Promise.reject(new Error('Missing EBAY_API_KEY in .env'));
    }
    return _request(_buildApiUrl(options))
        .then(_transformEbayResponse);
};
const _transformEbayResponse = listings => {
    //  their JSON is all wrapped in single item arrays :/
    const [ firstKey ] = Object.keys(listings);
    const resultSet = listings[firstKey][0].searchResult[0].item;
    return resultSet
        .filter(l => !!l.galleryURL && l.galleryURL.length && sellingStatuses.includes(l.sellingStatus[0].sellingState[0]))
        .map(l => {
            const [ about ] = l.title;
            const price = ~~parseFloat(l.sellingStatus[0].convertedCurrentPrice[0].__value__);
            const [{shippingServiceCost}] = l.shippingInfo;
            const shipping = shippingServiceCost ? +shippingServiceCost[0].__value__ === 0 ? 'Free' : ~~shippingServiceCost[0].__value__ : '';

            return toResult({
                about,
                price,
                image: l.galleryURL[0],
                sold: SELLING_STATUSES.SOLD === l.sellingStatus[0].sellingState[0],
                url: l.viewItemURL[0],
                date: ~~(new Date(l.listingInfo[0].endTime[0]).getTime() / 1000),
                shipping
            });
        });
};

module.exports = {
    search(query) {
        return Promise.all([
            this.searchSoldListings(query),
            this.searchLiveListings(query)
        ])
            .then(([sold, live]) => sold.concat(live).sort((a, b) => b.price - a.price));
    },
    searchSoldListings(q) {
        return _apiFetch({
            controller: 'findCompletedItems',
            q,
            filters: [
                {
                    name: 'SoldItemsOnly',
                    value: 'true'
                }
            ]
        });
    },
    searchLiveListings(q) {
        return _apiFetch({
            controller: 'findItemsAdvanced',
            q
        });
    }
};
