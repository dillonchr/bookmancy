module.exports = slacker = (query, searchUrl, x) => {
    let demo = {
        "attachments": [
            {
                "fallback": "Required plain-text summary of the attachment.",
                "color": "#36a64f",
                "author_name": "Price Results",
                "title": "Capote - In Cold Blood - Random - 1965",
                "title_link": "https://api.slack.com/",
                "fields": [
                    {
                        "title": "$23.99",
                        "short": false
                    },
                    {
                        "title": "$45.99",
                        "short": false
                    }
                ]
            }
        ]
    };
    let searchTitle = Object.keys(query)
        .map(k => query[k])
        .join(' - ');
    let response = {
      attachments: [
          {
              author_name: "Bookmancy Price Results",
              title: searchTitle,
              title_link: searchUrl,
              fields: x.map(r => ({short: false, title: r.price}))
          }
      ]
    };
    return JSON.stringify(response);
};