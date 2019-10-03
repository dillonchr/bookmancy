module.exports = (options) => {
    if (!process.env.EBAY_API_KEY) {
        throw new Error('Missing EBAY_API_KEY in .env');
    }

    const q = Object.entries(options)
        .filter(([key]) => ['author', 'title', 'publisher', 'year'].includes(key))
        .map(([k, val]) => val)
        .join(' ');

    const filters = [{
        name: 'HideDuplicateItems',
        value: 'true'
    }];

    let controller = 'findItemsAdvanced';

    if (options.sold) {
        filters.push({name: 'SoldItemsOnly', value: 'true'});
        controller = 'findCompletedItems';
    }

    const filtersQuery = filters
        .reduce((str, {name, value}, i) => {
            const v = `&itemFilter(${i})`;
            return `${str}${v}.name=${name}${v}.value=${value}`;
        }, '');

    return `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=${controller}&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${process.env.EBAY_API_KEY}&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD${filtersQuery}&paginationInput.entriesPerPage=100&sortOrder=PricePlusShippingHighest&categoryId=267&keywords=${encodeURIComponent(q)}`;
};
