let request = require('./request-builder');
let urlographer = require('./url-builder');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let slackResponder = require('./slack-responder');
let slackInterpreter = require('./slack-interpreter');

app.use(express.static('view'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/search.json', (req, res) => {
    request(urlographer(req.query))
        .then(x => res.send(x), err => res.send(err.toString()));
});
app.post('/slack.json', (req, res) => {
    try {
        if(req.body.text === 'help') {
            return res.send({
                response_type: 'ephemeral',
                text: 'search for book prices with `author, title, publisher, year, format`',
                mrkdown: true
            });
        }

        let query = slackInterpreter(req.body.text);
        let searchUrl = urlographer(query);
        request(searchUrl)
            .then(x => slackResponder(query, searchUrl, x, req), err => console.error(err.toString()));
        res.send({
            "response_type": "ephemeral",
            "text": `Checking out ${Object.keys(query).reverse().map(k=>k + ': ' + query[k]).join(', ')}`
        });
    } catch(err) {
        res.send({
            "response_type": "ephemeral",
            "text": "There was a problem processing your search. Try again soon."
        });
        console.error(err);
    }
});
app.listen(process.env.PORT || 3000, () => console.log('Location confirmed. Sending supplies.'));
