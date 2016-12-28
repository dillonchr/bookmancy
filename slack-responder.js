module.exports = slacker = (query, searchUrl, x) => {
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
        attachments: [
            {
                author_name: "Bookmancy Price Results",
                color: `#${hiddenResultsColor}`,
                pretext: `Searched for \`${searchTitle}\``,
                text: `There are ${hiddenResultsIdenifier} more results in the search above :point_up:`,
                title: `See Search Results For: ${searchTitle}`,
                title_link: searchUrl,
                fields: sharedResults.map(r => ({
                    short: false,
                    title: r.price + (r.year ? ` (${r.year})`: ''),
                    value: r.about.length > 120 ?
                        r.about.substr(0, 120) + '...' :
                        r.about
                })),
                fallback: searchTitle + sharedResults.map(r => r.price).join(' :: '),
                footer: 'AbeBooks API',
                footer_icon: 'https://www.abebooks.com/images/gateway/heroes/bookbird-avatar.png',
                ts: Math.floor(new Date().getTime() / 1000)
            }
        ]
    };
    let resultWithImage = x.find(r => !!r.image);
    if (resultWithImage) {
        response.attachments[0].thumb_url = resultWithImage.image;
    }
    /**
     * this is directly fed to the user's browser
     */
    return JSON.stringify(response);
};