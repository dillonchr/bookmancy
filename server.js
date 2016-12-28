let request = require('./request-builder');
let urlographer = require('./url-builder');
let express = require('express');
let app = express();
let slackResponder = require('./slack-responder');

app.use(express.static('view'));
app.get('/search.json', (req, res) => {
    request(urlographer(req.query))
        .then(x => res.send(x), err => res.send(err.toString()));
});
app.get('/slack.json', (req, res) => {
    let searchUrl = urlographer(req.query);
    request(searchUrl)
        .then(x => res.send(slackResponder(req.query, searchUrl, x)), err => res.send(err.toString()));
});
app.listen(process.env.PORT || 3000, () => console.log('Location confirmed. Sending supplies.'));
