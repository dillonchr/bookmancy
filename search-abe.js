const request = require('./request-builder');

function search(author, title, publisher, year, format) {
    const query = {
        author,
        title,
        publisher,
        year: format && !isNaN(format) ? format : !isNaN(year) && year,
        format: isNaN(year) ? year : format
    };

    return request(query)
        .then(x => {
            //    x.url, x.results
        })
        .catch(err => {
            console.error(err, err.stack);
        });
}

module.exports = {
    search: search,
    onSearch: confirmSearch
};