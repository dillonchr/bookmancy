const toResult = require('../result-model');
const _getItemProp = (name, elem) => {
    const metaTag = elem.querySelector('meta[itemprop="' + name + '"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }
};

const _getItemPrice = el => {
    const price = el.querySelector('.item-price .price');
    if (price) {
        return price.innerHTML.substr(4);
    }
    return '???';
};

const _getItemShipping = el => {
    const shipping = el.querySelector('.shipping .price');
    if (shipping) {
        return shipping.textContent.substr(4);
    }
    return '';
};

const _getItemImage = el => {
    const img = el.querySelector('.result-image img');
    if (img.className.includes('no-book-image') || !img) {
        return null;
    }
    return img.src;
};

module.exports = document => {
    return Array.from(document.querySelectorAll('.cf.result'))
        .map(el => toResult({
                year: _getItemProp('datePublished', el),
                about: _getItemProp('about', el),
                price: _getItemPrice(el),
                shipping: _getItemShipping(el),
                image: _getItemImage(el)
            }));
};
