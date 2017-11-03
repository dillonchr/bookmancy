require('dotenv').config();
const request = require('request-promise-native');
//    idky but index has TOKEN lowercased and I don't feel like trialNErroring this
const API_KEY = process.env.EBAY_API_KEY;
const SELLING_STATUSES = {
    SOLD: 'EndedWithSales',
    LIVE: 'Active'
};
const sellingStatuses = Object.keys(SELLING_STATUSES)
    .map(k => SELLING_STATUSES[k]);

class SearchEbay {
    search(query) {
        return Promise.all([
            this.searchSoldListings(query),
            this.searchLiveListings(query)
        ])
            .then(([sold, live]) => sold.concat(live).sort((a, b) => b.price - a.price));
    }

    buildApiUrl({controller, filters = [], q}) {
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
    }

    apiFetch(options) {
        return request(this.buildApiUrl(options))
            .then(r => {
                const data = r.trim();
                //    jsonp converstion
                return JSON.parse(data.substr(7, data.length - 8));
            })
            .then(this.transformEbayResponse.bind(this));
    }

    transformEbayResponse(listings) {
        //  their JSON is all wrapped in single item arrays :/
        const [ firstKey ] = Object.keys(listings);
        const resultSet = listings[firstKey][0].searchResult[0].item;
        return resultSet
            .filter(l => !!l.galleryURL && l.galleryURL.length && sellingStatuses.includes(l.sellingStatus[0].sellingState[0]))
            .map(l => {
                const [ about ] = l.title;
                const price = Math.round(parseFloat(l.sellingStatus[0].convertedCurrentPrice[0].__value__));

                return {
                    about,
                    price,
                    image: l.galleryURL[0],
                    sold: SELLING_STATUSES.SOLD === l.sellingStatus[0].sellingState[0],
                    url: l.viewItemURL[0],
                    date: ~~(new Date(l.listingInfo[0].endTime[0]).getTime() / 1000)
                };
            });
    }

    searchSoldListings(q) {
        return this.apiFetch({
            controller: 'findCompletedItems',
            q,
            filters: [
                {
                    name: 'SoldItemsOnly',
                    value: 'true'
                }
            ]
        });
    }

    searchLiveListings(q) {
        return this.apiFetch({
            controller: 'findItemsAdvanced',
            q
        });
    }
}

module.exports = SearchEbay;
