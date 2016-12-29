let request = require('request');

module.exports = slacker = (query, searchUrl, x, slackReq) => {
    const MAX_RESULTS = 50;
    const RESULTS_LIMIT = 5;
    /**
     * slack doesn't need full results listed, just first three
     * @type {*}
     */
    let sharedResults = x.slice(0, RESULTS_LIMIT);
    /**
     * search title for quick reference in searches of old queries
     * @type {string}
     */
    let searchTitle = Object.keys(query)
        .map(k => query[k])
        .join(' - ');
    /**
     * counting unshown results here
     * @type {string}
     */
    let hiddenResultsIdenifier = x.length === MAX_RESULTS ? 'many' : x.length - RESULTS_LIMIT > 0 ? 'some' : 'no';
    /**
     * color-coding the message based on result count
     * @type {string}
     */
    let hiddenResultsColor = hiddenResultsIdenifier === 'many' ?
        '01897B' : hiddenResultsIdenifier === 'some' ? 'FDD838' : 'EF5A53';
    /**
     * building response in var for debugging
     * FIXME: just return stringified response after tested fully
     * @type {{attachments: [*]}}
     */
    let response = {
        response_type: 'in_channel',
        text: `Searched for \`${searchTitle}\``,
        mrkdown: true,
        attachments: [
            {
                author_name: "Bookmancy Price Results",
                color: `#${hiddenResultsColor}`,
                text: `There are ${hiddenResultsIdenifier} more results in the search above :point_up:`,
                title: `See Search Results For: ${searchTitle}`,
                title_link: searchUrl,
                footer: 'AbeBooks API',
                footer_icon: 'https://www.abebooks.com/images/gateway/heroes/bookbird-avatar.png',
                ts: Math.floor(new Date().getTime() / 1000)
            }
        ]
    };

    sharedResults.map(r => ({
        color: `#${hiddenResultsColor}`,
        title: '$' + r.price + r.shipping + (r.year ? ` (${r.year})` : ''),
        text: r.about.length > 120 ?
            r.about.substr(0, 120) + '...' :
            r.about,
        fallback: r.price,
        thumb_url: r.image
    }))
        .forEach(r => response.attachments.push(r));


    return new Promise((resolve, reject) => {
        let opts = {
            url: slackReq.body.response_url,
            method: 'POST',
            json: true,
            body: response,
            header: {
                token: slackReq.body.token
            }
        };
        request(opts,
            (err, res, body) => {
                if (!err && res && res.statusCode == 200) {
                    resolve(body);
                }
                reject(err);
            });
    });
};