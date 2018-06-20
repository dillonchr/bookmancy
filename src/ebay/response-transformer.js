const toResult = require('../result-model.js');

const SELLING_STATUSES = {
    SOLD: 'EndedWithSales',
    LIVE: 'Active'
};

const sellingStatuses = Object.keys(SELLING_STATUSES)
    .map(k => SELLING_STATUSES[k]);

module.exports = (listings) => {
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
