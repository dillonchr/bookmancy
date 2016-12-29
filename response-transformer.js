module.exports = function transformApiResponse(document) {
    let searchResults = document.querySelectorAll('.cf.result');

    function getItemProp(name, elem) {
        let metaTag = elem.querySelector('meta[itemprop="' + name + '"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
    }

    function getItemPrice(el) {
        return el.querySelector('.item-price .price').innerHTML.substr(4);
    }

    function getItemShipping(el) {
        let shipping = el.querySelector('.shipping .price');
        if (shipping) {
            return ` + $${shipping.textContent.substr(4)} s/h `;
        }
        return '';
    }

    function getItemImage(el) {
        let img = el.querySelector('.result-image img');
        if (el.querySelector('.no-book-image') || !img) {
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
