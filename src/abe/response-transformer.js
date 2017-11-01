const getItemProp = (name, elem) => {
    const metaTag = elem.querySelector('meta[itemprop="' + name + '"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }
};

const getItemPrice = el => {
    const price = el.querySelector('.item-price .price');
    if (price) {
        return price.innerHTML.substr(4);
    }
    return '???';
};

const getItemShipping = el => {
    const shipping = el.querySelector('.shipping .price');
    if (shipping) {
        return shipping.textContent.substr(4);
    }
    return '';
};

const getItemImage = el => {
    const img = el.querySelector('.result-image img');
    if (img.className.includes('no-book-image') || !img) {
        return null;
    }
    return img.src;
};

module.exports = document => {
    return Array.from(document.querySelectorAll('.cf.result'))
        .map(el => ({
                year: getItemProp('datePublished', el),
                about: getItemProp('about', el),
                price: getItemPrice(el),
                shipping: getItemShipping(el),
                image: getItemImage(el)
            }));
};
