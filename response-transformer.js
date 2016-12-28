module.exports = function transformApiResponse(document) {
    let searchResults = document.querySelectorAll('.cf.result');

    function getItemProp(name, elem) {
        let metaTag = elem.querySelector('meta[itemprop="' + name + '"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
    }

    return Array.from(searchResults)
        .slice(0, 3)
        .map(el => ({
                year: getItemProp('datePublished', el),
                about: getItemProp('about', el),
                price: el.querySelector('.item-price .price').innerHTML.substr(4)
            })
        );
};
