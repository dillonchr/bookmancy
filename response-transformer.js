module.exports = function transformApiResponse(document) {
    const searchResults = document.querySelectorAll('.cf.result');

    function getItemProp(name, elem) {
        const metaTag = elem.querySelector('meta[itemprop="' + name + '"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
    }

    function getItemPrice(el) {
        return el.querySelector('.item-price .price').innerHTML.substr(4);
    }

    function getItemShipping(el) {
        const shipping = el.querySelector('.shipping .price');
        if (shipping) {
            return shipping.textContent.substr(4);
        }
        return '';
    }

    function getItemImage(el) {
        const img = el.querySelector('.result-image img');
        if (img.className.includes('no-book-image') || !img) {
            return null;
        }
        return img.src;
    }

    return Array.from(searchResults)
        .map(el => ({
                year: getItemProp('datePublished', el),
                about: getItemProp('about', el),
                price: getItemPrice(el),
                shipping: getItemShipping(el),
                image: getItemImage(el)
            })
        );
};
