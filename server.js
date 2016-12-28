let request = require('./request-builder');
let urlographer = require('./url-builder');
let express = require('express');
let app = express();
let slackResponder = require('./slack-responder');
let slackInterpreter = require('./slack-interpreter');

app.use(express.static('view'));
app.get('/search.json', (req, res) => {
    request(urlographer(req.query))
        .then(x => res.send(x), err => res.send(err.toString()));
});
app.post('/slack.json', (req, res) => {
    res.send(JSON.stringify({
        "response_type": "ephemeral",
        "text": "Checking it out for you"
    }));

    let query = slackInterpreter.convertToQuery(req.command);
    let searchUrl = urlographer(query);
    request(searchUrl)
        .then(x => slackResponder(query, searchUrl, x, req), err => console.error(err.toString()));
});
app.listen(process.env.PORT || 3000, () => console.log('Location confirmed. Sending supplies.'));
