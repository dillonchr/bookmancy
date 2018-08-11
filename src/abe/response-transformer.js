const toResult = require('../result-model.js');

const getItemProp = (name, elem) => {
    const metaTag = elem.querySelectorAll('meta')
        .find(m => m.attributes.itemprop && m.attributes.itemprop === name);

    if (metaTag) {
        return metaTag.attributes.content;
    }
};

const getUrl = el => {
    const a = el.querySelector('[itemprop="url"]');
    return a && `https://www.abebooks.com${a.attributes.href}`;
};

const getItemPrice = el => {
    const price = el.querySelector('.srp-item-price') || el.querySelector('.price');
    if (price) {
        return price.innerHTML.substr(4);
    }
    return '???';
};

const getItemShipping = el => {
    const shipping = el.querySelector('.srp-item-price-shipping') ||
        el.querySelector('.shipping .price');

    if (shipping) {
        return shipping.text.substr(4);
    }
    return '';
};

const getItemImage = el => {
    const img = el.querySelector('.result-image img');
    if (img.classNames.includes('no-book-image') || !img) {
        return null;
    }
    return img.attributes.src;
};

module.exports = (document) => {
    return document.querySelectorAll('.cf.result')
        .map((el) => toResult({
            year: getItemProp('datePublished', el),
            about: getItemProp('about', el),
            price: getItemPrice(el),
            shipping: getItemShipping(el),
            image: getItemImage(el),
            url: getUrl(el)
        }));
};

